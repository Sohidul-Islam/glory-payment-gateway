/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword, ResetPasswordData } from "../network/services";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  KeyIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [resetComplete, setResetComplete] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Extract token from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [location]);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: any) => {
      console.log({ data });
      if (data?.status) {
        toast.success("Password reset successful!");
        setResetComplete(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data?.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Password reset failed");
      setError(error?.message || "Password reset failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (passwordStrength < 3) {
      setError("Please choose a stronger password");
      return;
    }

    const resetData: ResetPasswordData = {
      token,
      newPassword: password,
    };

    resetMutation.mutate(resetData);
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-400";
    if (passwordStrength === 2) return "bg-yellow-400";
    if (passwordStrength === 3) return "bg-blue-400";
    return "bg-green-400";
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "No password";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
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
          <h1 className="text-4xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-lg opacity-90">
            Create a new, strong password to keep your account secure.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 p-8 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-full">
              <ShieldCheckIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Password Security Tips</h3>
              <p className="text-sm opacity-80">
                Creating a strong password is essential
              </p>
            </div>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium mt-0.5">
                <svg
                  className="w-4 h-4"
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
              <div className="ml-3">
                <p className="font-medium">Use at least 8 characters</p>
                <p className="text-sm opacity-80">
                  Longer passwords are harder to crack
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium mt-0.5">
                <svg
                  className="w-4 h-4"
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
              <div className="ml-3">
                <p className="font-medium">Mix letters, numbers & symbols</p>
                <p className="text-sm opacity-80">
                  Adding variety increases security
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium mt-0.5">
                <svg
                  className="w-4 h-4"
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
              <div className="ml-3">
                <p className="font-medium">Avoid common phrases</p>
                <p className="text-sm opacity-80">
                  Don't use easily guessable information
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium mt-0.5">
                <svg
                  className="w-4 h-4"
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
              <div className="ml-3">
                <p className="font-medium">Use a unique password</p>
                <p className="text-sm opacity-80">
                  Never reuse passwords across accounts
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
              <LockClosedIcon className="h-8 w-8" />
            </div>
          </div>

          {!resetComplete ? (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                Create New Password
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Your password must be different from previously used passwords
                and meet our security requirements.
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

              {!token && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Invalid or missing reset token. Please use the link from
                      your email.
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          Password strength:
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength < 2
                              ? "text-red-500"
                              : passwordStrength < 3
                              ? "text-yellow-500"
                              : passwordStrength < 4
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}
                        >
                          {getStrengthLabel()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${passwordStrength * 25}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      Passwords don't match
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={
                      resetMutation.isPending ||
                      !token ||
                      password !== confirmPassword
                    }
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-150 disabled:opacity-50"
                  >
                    {resetMutation.isPending ? (
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
                        Resetting Password...
                      </div>
                    ) : (
                      "Reset Password"
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
                Password Reset Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. You'll be redirected
                to the login page in a few seconds.
              </p>
              <Link
                to="/login"
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          <div className="mt-8 text-center">
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

export default ResetPassword;
