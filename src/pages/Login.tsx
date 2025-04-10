/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser, LoginData } from "../network/services";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  EnvelopeIcon,
  KeyIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { successToast } from "../utils/utils";

const Login = () => {
  //   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  //   const loginMutation = useMutation({
  //     mutationFn: loginUser,
  //     onSuccess: (data) => {
  //       if (data.status) {
  //         login(data);
  //         navigate("/dashboard");
  //       } else {
  //         setError(data.message);
  //       }
  //     },
  //     onError: (error: Error) => {
  //       setError(error.message || "Login failed. Please check your credentials.");
  //     },
  //   });

  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: any) => {
      if (data?.status) {
        login(data?.data);
        successToast(data?.message || "Login successful", "success");
      } else {
        setError(data?.message || "Login failed");
      }
    },
    onError: (error: Error) => {
      successToast(error?.message || "Login failed", "error");
      setError(error?.message || "Login failed");
    },
  });

  const onSubmit = (data: LoginData) => {
    mutation.mutate(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setError(null);

  //     const loginData: LoginData = {
  //       email: formData.email,
  //       password: formData.password,
  //     };

  //     loginMutation.mutate(loginData);
  //   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex">
      {/* Left Column - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/90 to-primary-900/90 z-0"></div>
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#pattern)" />
          </svg>
          <defs>
            <pattern
              id="pattern"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="5" cy="5" r="1.5" fill="white" />
            </pattern>
          </defs>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">LendenPay</h1>
          <p className="text-lg opacity-90">
            Secure, fast, and reliable payment processing solution for your
            business needs.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 p-8 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-full">
              <LockClosedIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Secure Authentication</h3>
              <p className="text-sm opacity-80">
                Your security is our top priority
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Military-grade encryption</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Two-factor authentication</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>24/7 fraud monitoring</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-sm opacity-80">
          &copy; {new Date().getFullYear()} LendenPay. All rights reserved.
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-full bg-primary-600 text-white flex items-center justify-center">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex">
                <svg
                  className="h-5 w-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(formData);
            }}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-gray-700"
              >
                Keep me signed in
              </label>
            </div> */}

            <div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-150 disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-primary-50 to-gray-100 text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500 inline-block transition-colors"
              >
                Create an account
              </Link>
            </div>
          </form>
          {/* 
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-primary-50 to-gray-100 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.5 12.0645C22.5 6.26602 17.7984 1.56445 12 1.56445C6.20156 1.56445 1.5 6.26602 1.5 12.0645C1.5 17.3051 5.33906 21.649 10.3594 22.4364V15.0332H7.69266V12.0645H10.3594V9.85968C10.3594 7.27423 11.9227 5.82471 14.2869 5.82471C15.4125 5.82471 16.5844 6.01515 16.5844 6.01515V8.5933H15.2883C14.0133 8.5933 13.6406 9.37687 13.6406 10.1796V12.0645H16.4625L16.0354 15.0332H13.6406V22.4364C18.6609 21.649 22.5 17.3051 22.5 12.0645Z"
                    fill="#1877F2"
                  />
                  <path
                    d="M16.0354 15.0332L16.4625 12.0645H13.6406V10.1796C13.6406 9.37687 14.0133 8.5933 15.2883 8.5933H16.5844V6.01515C16.5844 6.01515 15.4125 5.82471 14.2869 5.82471C11.9227 5.82471 10.3594 7.27423 10.3594 9.85968V12.0645H7.69266V15.0332H10.3594V22.4364C10.8914 22.5136 11.4367 22.5651 12 22.5651C12.5633 22.5651 13.1086 22.5136 13.6406 22.4364V15.0332H16.0354Z"
                    fill="white"
                  />
                </svg>
                Facebook
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
