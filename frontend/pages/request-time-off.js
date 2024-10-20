import React from 'react';
import TimeOffRequestForm from '../components/TimeOffRequestForm';
import { useUser } from '../context/UserContext';
import Link from 'next/link';

const RequestTimeOffPage = () => {
    const { user } = useUser();

    const handleRequestSubmitted = (message, isError) => {
        if (isError) {
          console.error(message);
        } else {
          alert(`Request successful: ${message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold text-center">Request Time Off</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <TimeOffRequestForm onRequestSubmitted={handleRequestSubmitted} />
                            <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                                <Link href="/" className="text-cyan-600 hover:text-cyan-700">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestTimeOffPage;
