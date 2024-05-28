import React, { useState } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export default function Register({registerIn}) {
    const navigate = useNavigate();
    const [serverErrors, setServerErrors] = useState(null);
    
   

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters')
            .max(128, 'Password must be at most 128 characters')
            .required('Password is required')
    });

    const initialValues = {
        username: '',
        email: '',
        password: ''
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('/api/users/register', values);
            // alert('Succesfully registered')
            registerIn()
            navigate('/login');
        } catch (err) {
            setServerErrors(err.response.data.errors);
        
        } finally {
            setSubmitting(false);
        }
    };

    const handleCheckEmail = async (email, setFieldError) => {
        if (Yup.string().email().isValidSync(email)) {
            try {
                const response = await axios.get(`/api/users/checkemail?email=${email}`);
                if (response.data.is_email_registered) {
                    setFieldError('email', 'Email already taken');
                }
            } catch (err) {
                setFieldError('email', 'Error checking email');
            }
        }
    };

    return (
        <section className="h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
                <div className="md:flex md:justify-between">
                    {/* Left column with image */}
                    <div className="md:w-1/2">
                        <img src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="w-full" alt="Sample image" />
                    </div>
                    {/* Right column with form */}
                    <div className="p-8 md:w-1/2">
                        <h2 className="text-2xl font-bold mb-6">Register Here</h2>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, setFieldError, isSubmitting }) => (
                                <Form>
                                    {/* Username input */}
                                    <div className="mb-4">
                                        <label htmlFor="username" className="block text-gray-700 mb-2">Enter Username</label>
                                        <Field type="text" id="username" name="username" className="form-input w-full border border-gray-300 rounded px-3 py-2" />
                                        <ErrorMessage name="username" component="div" className="text-red-500 mt-1" />
                                    </div>
                                    {/* Email input */}
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-gray-700 mb-2">Enter Email</label>
                                        <Field 
                                            type="email" 
                                            id="email" 
                                            name="email"
                                            onBlur={(e) => handleCheckEmail(e.target.value, setFieldError)}
                                            className="form-input w-full border border-gray-300 rounded px-3 py-2" 
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 mt-1" />
                                    </div>
                                    {/* Password input */}
                                    <div className="mb-4">
                                        <label htmlFor="password" className="block text-gray-700 mb-2">Enter Password</label>
                                        <Field type="password" id="password" name="password" className="form-input w-full border border-gray-300 rounded px-3 py-2" />
                                        <ErrorMessage name="password" component="div" className="text-red-500 mt-1" />
                                    </div>
                                    {/* Server error messages */}
                                    {serverErrors && (
                                        <div className="mb-4">
                                            {/* <h3 className="text-red-500 font-bold">These are the server errors:</h3> */}
                                            <ul className="text-red-500">
                                                {serverErrors.map((error, index) => (
                                                    <li key={index}>{error.msg}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Submit button */}
                                    <div className="mb-6">
                                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700">Submit</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <p className="text-gray-700 text-sm">Have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
                    </div>
                </div>
            </div>
         
        </section>
    );
}
