import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword, ForgotPasswordData } from "../network/services";
import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Password reset instructions sent to your email!");
      setEmailSent(true);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to send reset instructions");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const forgotPasswordData: ForgotPasswordData = {
      email,
    };

    mutation.mutate(forgotPasswordData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex">
      {/* Left Column - Brand/Information */}
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
          <h1 className="text-4xl font-bold mb-2">Account Recovery</h1>
          <p className="text-lg opacity-90">
            We'll help you reset your password and get back to your account.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 p-8 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-full">
              <ShieldCheckIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Secure Recovery Process</h3>
              <p className="text-sm opacity-80">
                Multi-layered verification for your security
              </p>
            </div>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium mt-0.5">
                1
              </div>
              <div className="ml-3">
                <p className="font-medium">Enter your email address</p>
                <p className="text-sm opacity-80">
                  We'll verify that it's registered with us
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium mt-0.5">
                2
              </div>
              <div className="ml-3">
                <p className="font-medium">Check your inbox</p>
                <p className="text-sm opacity-80">
                  We'll send you a link to reset your password
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium mt-0.5">
                3
              </div>
              <div className="ml-3">
                <p className="font-medium">Create a new password</p>
                <p className="text-sm opacity-80">
                  Choose a strong, unique password for your account
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-sm opacity-80">
          &copy; {new Date().getFullYear()} LendenPay All rights reserved.
        </div>
      </div>

      {/* Right Column - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-full bg-primary-600 text-white flex items-center justify-center">
              <ArrowPathIcon className="h-8 w-8" />
            </div>
          </div>

          {!emailSent ? (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                Forgot your password?
              </h2>
              <p className="text-center text-gray-600 mb-8">
                No worries! Enter your email address and we'll send you
                instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

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
                        Sending Reset Link...
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center bg-green-50 border border-green-100 rounded-xl p-8 shadow-sm">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg
                  className="h-8 w-8 text-green-600"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Check your email
              </h3>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or try again in
                a few minutes.
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Try a different email address
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Remember your password?</p>
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 inline-block transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
