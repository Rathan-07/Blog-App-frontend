import { useState } from 'react';
import axios from '../config/axios';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ClipLoader } from 'react-spinners'; // Import the ClipLoader spinner
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [loading, setLoading] = useState(false); // Initialize loading state

    const showToastMessage = () => {
        toast.success("Successfully Logged In!", {
            position: "bottom-left",
        });
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').max(128, 'Password must be at most 128 characters'),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        setLoading(true); // Set loading to true when form is submitted

        try {
            const response = await axios.post('/api/users/login', values);
            localStorage.setItem('token', response.data.token);
            const userResponse = await axios.get('/api/users/profile', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            dispatch({ type: "LOGIN", payload: { account: userResponse.data } });
            showToastMessage();
            // Introduce a delay to ensure spinner is visible for at least 2 seconds
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/list-posts');
        } catch (err) {
            if (err.response && err.response.data.errors) {
                setErrors({ serverErrors: err.response.data.errors });
            } else if (err.response && err.response.data.message) {
                setErrors({ serverErrors: err.response.data.message });
            }
        } finally {
            setLoading(false); // Reset loading state after login attempt
            setSubmitting(false);
        }
    };

    return (
        <section className="h-screen bg-gray-100 flex items-center justify-center">
            <div className="container h-full px-6 py-12">
                <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
                    <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
                        <img src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="w-full" alt="Phone image" />
                    </div>

                    <div className="md:w-8/12 lg:ms-6 lg:w-5/12 bg-white p-8 rounded shadow-lg">
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors }) => (
                                <Form className="space-y-4">
                                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                                    
                                    <div className="relative mb-6">
                                        <Field type="text" id="email" name="email" placeholder="Email address" className="w-full rounded border border-gray-300 px-3 py-2 focus:ring focus:ring-green-500 focus:outline-none" />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="relative mb-6">
                                        <Field type="password" id="password" name="password" placeholder="Password" className="w-full rounded border border-gray-300 px-3 py-2 focus:ring focus:ring-green-500 focus:outline-none" />
                                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <button type="submit" disabled={isSubmitting || loading} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center">
                                        {loading ? <ClipLoader size={24} color={"#fff"} /> : "Sign in"} {/* Conditional rendering of spinner based on loading state */}
                                    </button>

                                    {errors && errors.serverErrors && (
                                        <div className="text-red-500 text-sm mt-2">
                                            {typeof errors.serverErrors === 'string' ? (
                                                <p>{errors.serverErrors}</p>
                                            ) : (
                                                <ul>
                                                    {errors.serverErrors.map((error, index) => (
                                                        <li key={index}>{error.msg}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </Form>
                            )}
                        </Formik>

                        <div className="mt-4 text-center">
                            <p>Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
