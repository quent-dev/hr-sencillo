from flask import request, jsonify, render_template, session, redirect, url_for
from app import app, supabase
from datetime import datetime
import logging
from supabase import create_client, Client
from gotrue.errors import AuthApiError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/request-time-off')
def request_time_off_page():
    if 'user' not in session:
        return redirect(url_for('index'))
    return render_template('request_time_off.html')

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    try:
        response = supabase.auth.sign_in_with_password({"email": data['email'], "password": data['password']})
        user = response.user
        session['user'] = user.email
        session['access_token'] = response.session.access_token
        session['refresh_token'] = response.session.refresh_token
        session.permanent = True
        logger.debug(f"Session after login: {session}")
        return jsonify({'user': user.email}), 200
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        return jsonify({'error': 'Login failed'}), 400

@app.route('/api/auth/logout')
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/auth/user')
def get_current_user():
    if 'user' in session:
        return jsonify({'user': session['user']}), 200
    else:
        return jsonify({'error': 'Not authenticated'}), 401

@app.route('/api/request-time-off', methods=['POST'])
def request_time_off():
    
    data = request.json
    
    try:
        user_email = data['email']
        logger.debug(f"User email from session: {user_email}")
        employee = supabase.table('Employee').select('*').eq('email', user_email).execute()
        
        if not employee.data:
            return jsonify({'error': 'Employee not found'}), 404

        employee_id = employee.data[0]['id']

        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

        if start_date <= datetime.now().date() or end_date < start_date:
            return jsonify({'error': 'Invalid date range'}), 400

        overlapping = supabase.table('TimeOffRequest').select('*').eq('employee_id', employee_id).lte('start_date', str(end_date)).gte('end_date', str(start_date)).execute()
        if overlapping.data:
            return jsonify({'error': 'Overlapping request exists'}), 400

        new_request_data = {
            'employee_id': employee_id,
            'start_date': str(start_date),
            'end_date': str(end_date),
            'request_type': data['request_type'],
            'comments': data.get('comments', ''),
            'status': 'pending'
        }
        logger.debug(f'New request data: {new_request_data}')
        new_request = supabase.table('TimeOffRequest').insert(new_request_data).execute()

        if new_request.data:
            return jsonify({'message': 'Time off request submitted successfully'}), 201
        else:
            return jsonify({'error': 'Failed to submit request'}), 500

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# This should be outside the route function
# @app.before_first_request
# def log_all_employees():
#     all_employees = supabase.table('Employee').select('*').execute()
#     logger.debug(f"All employees: {all_employees.data}")

# # Add this new function:
# @app.before_request
# def log_request_info():
#     logger.debug('Headers: %s', request.headers)
#     logger.debug('Body: %s', request.get_data())
#     logger.debug('URL: %s', request.url)


@app.route('/<path:undefined_route>')
def undefined_route(undefined_route):
    logger.warning(f"Attempted to access undefined route: {undefined_route}")
    return jsonify({"error": "Route not found"}), 404

@app.route('/debug/routes')
def debug_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "route": str(rule)
        })
    return jsonify(routes)

@app.route('/api/auth/refresh', methods=['POST'])
def refresh_token():
    refresh_token = session.get('refresh_token')
    if not refresh_token:
        return jsonify({'error': 'No refresh token found'}), 401
    
    try:
        refresh_response = supabase.auth.refresh_session(refresh_token)
        session['access_token'] = refresh_response.session.access_token
        session['refresh_token'] = refresh_response.session.refresh_token
        return jsonify({'message': 'Token refreshed successfully'}), 200
    except Exception as e:
        logger.error(f"Token refresh failed: {str(e)}")
        return jsonify({'error': 'Token refresh failed'}), 400

@app.route('/profile')
def profile_page():
    if 'user' not in session:
        return redirect(url_for('index'))
    return render_template('profile.html')

@app.route('/api/profile', methods=['GET', 'POST'])
def get_profile():
    if request.method == 'POST':
        logger.debug(f"Raw request data: {request.data}")  # Log raw request data
        logger.debug(f"Request headers: {request.headers}")  # Log request headers
        # logger.debug(f"Request JSON: {request.json}")
        # Check if the request is JSON
        reqdata =request.get_json(force=True)
        # if not reqdata.is_json:
        #     logger.error('Request not in JSON')
        #     return jsonify({'error': 'Invalid request format'}), 400

        user_email = reqdata.get('user')  # Use request.json to get the parsed JSON
        logger.debug(f'user: {user_email}')
        if not user_email:
            return jsonify({'error': 'User email not provided'}), 400

        try:
            employee = supabase.table('Employee').select('*').eq('email', user_email).execute()
            
            if not employee.data:
                return jsonify({'error': 'Employee not found'}), 404

            employee_data = employee.data[0]
            logger.debug(f'Employee data: {employee_data}')
            current_year = datetime.now().year
            
            # Fetch all time off requests for this employee
            time_off_requests = supabase.table('TimeOffRequest').select('*').eq('employee_id', employee_data['id']).execute()
            
            # Calculate days taken and process request data
            days_taken = 0
            extra_work_days = 0
            processed_requests = []
            for req in time_off_requests.data:
                start_date = datetime.strptime(req['start_date'], '%Y-%m-%d').date()
                end_date = datetime.strptime(req['end_date'], '%Y-%m-%d').date()
                days = (end_date - start_date).days + 1
                
                if start_date.year == current_year:
                    if req['request_type'] == 'extra_work_hours':
                        extra_work_days += days
                    else:
                        days_taken += days
                
                processed_requests.append({
                    'id': req['id'],  # Include the id of the request
                    'start_date': req['start_date'],
                    'end_date': req['end_date'],
                    'request_type': req['request_type'],
                    'status': req['status'],
                    'total_days': days if req['request_type'] != 'extra_work_hours' else -days
                })

            net_days_taken = days_taken - extra_work_days
            
            profile_data = {
                'name': employee_data['name'],
                'email': employee_data['email'],
                'total_days_off': employee_data['days_off_total'],
                'days_taken': days_taken,
                'extra_work_days': extra_work_days,
                'net_days_taken': net_days_taken,
                'remaining_days': employee_data['days_off_total'] - net_days_taken,
                'time_off_requests': processed_requests
            }

            return jsonify(profile_data), 200

        except Exception as e:
            logger.error(f"An error occurred while fetching profile: {str(e)}")
            return jsonify({'error': 'An unexpected error occurred'}), 500

    # Handle GET request
    if 'user' not in session:
        return redirect(url_for('index'))
    return render_template('profile.html')

@app.route('/api/profile/update', methods=['POST'])
def update_profile():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        user_email = session['user']
        data = request.json

        employee = supabase.table('Employee').update({
            'name': data['name'],
            'email': data['email']
        }).eq('email', user_email).execute()

        if not employee.data:
            return jsonify({'error': 'Failed to update profile'}), 500

        return jsonify({'message': 'Profile updated successfully'}), 200

    except Exception as e:
        logger.error(f"An error occurred while updating profile: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/edit-request/<int:request_id>')
def edit_request_page(request_id):
    if 'user' not in session:
        return redirect(url_for('index'))
    return render_template('edit_request.html')

@app.route('/api/request/<int:request_id>', methods=['GET'])
def get_request(request_id):
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        user_email = session['user']
        employee = supabase.table('Employee').select('*').eq('email', user_email).execute()
        
        if not employee.data:
            return jsonify({'error': 'Employee not found'}), 404

        employee_id = employee.data[0]['id']
        
        request = supabase.table('TimeOffRequest').select('*').eq('id', request_id).eq('employee_id', employee_id).execute()
        
        if not request.data:
            return jsonify({'error': 'Request not found'}), 404

        return jsonify(request.data[0]), 200

    except Exception as e:
        logger.error(f"An error occurred while fetching request: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/api/request/<int:request_id>', methods=['PUT'])
def update_request(request_id):
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        user_email = session['user']
        employee = supabase.table('Employee').select('*').eq('email', user_email).execute()
        
        if not employee.data:
            return jsonify({'error': 'Employee not found'}), 404

        employee_id = employee.data[0]['id']
        
        data = request.json
        updated_request = supabase.table('TimeOffRequest').update({
            'start_date': data['start_date'],
            'end_date': data['end_date'],
            'request_type': data['request_type'],
            'comments': data['comments']
        }).eq('id', request_id).eq('employee_id', employee_id).execute()
        
        if not updated_request.data:
            return jsonify({'error': 'Failed to update request'}), 500

        return jsonify({'message': 'Request updated successfully'}), 200

    except Exception as e:
        logger.error(f"An error occurred while updating request: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/api/request/<int:request_id>', methods=['DELETE'])
def delete_request(request_id):
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        user_email = session['user']
        employee = supabase.table('Employee').select('*').eq('email', user_email).execute()
        
        if not employee.data:
            return jsonify({'error': 'Employee not found'}), 404

        employee_id = employee.data[0]['id']
        
        deleted_request = supabase.table('TimeOffRequest').delete().eq('id', request_id).eq('employee_id', employee_id).execute()
        
        if not deleted_request.data:
            return jsonify({'error': 'Failed to delete request or request not found'}), 404

        return jsonify({'message': 'Request deleted successfully'}), 200

    except Exception as e:
        logger.error(f"An error occurred while deleting request: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500






