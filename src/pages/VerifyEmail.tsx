/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { verifyEmail } from "../network/services";
import AgentLinkCard from "../components/AgentLinkCard";
import AXIOS from "../network/Axios";

interface UserData {
  id: number;
  fullName: string;
  email: string;
  agentId: string;
  isVerified: boolean;
  accountType: string;
}

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);

  // Extract token and email from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    const emailParam = params.get("email");

    if (tokenParam) {
      setToken(tokenParam);
    }
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  // Fetch user data after successful verification
  const fetchUserData = async (email: string) => {
    try {
      const response = await AXIOS.get(`/profile?email=${email}`);
      console.log("User data response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data", error);
      return null;
    }
  };

  // Query for user data
  const userQuery = useQuery({
    queryKey: ["userData", email],
    queryFn: () => fetchUserData(email),
    enabled: false, // Don't run automatically
  });

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data: any) => {
      if (data?.status) {
        setVerificationStatus("success");
        toast.success("Email verified successfully!");

        // Fetch user data
        userQuery.refetch().then((result) => {
          if (result.data) {
            console.log("User data from query:", result.data);
            setUserData(result.data);
          }
        });

        // Redirect to login after 5 seconds (increased from 3 to give time to see agent card)
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        setVerificationStatus("error");
        setErrorMessage(data?.message || "Email verification failed");
        toast.error(data?.message || "Email verification failed");
      }
    },
    onError: (error: Error) => {
      setVerificationStatus("error");
      setErrorMessage(error?.message || "Email verification failed");
      toast.error(error?.message || "Email verification failed");
    },
  });

  // Auto-verify on component mount if token and email are present
  useEffect(() => {
    if (token && email && verificationStatus === "idle") {
      verifyMutation.mutate({ token, email });
    }
  }, [token, email, verificationStatus]);

  const handleManualVerify = () => {
    if (!token || !email) {
      toast.error("Token or email is missing");
      return;
    }
    verifyMutation.mutate({ token, email });
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
          <h1 className="text-4xl font-bold mb-2">Email Verification</h1>
          <p className="text-lg opacity-90">
            Thank you for verifying your email address. This helps us keep your
            account secure.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 p-8 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-full">
              <EnvelopeIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Why verify your email?</h3>
              <p className="text-sm opacity-80">
                Email verification provides additional security
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
                <p className="font-medium">Secure your account</p>
                <p className="text-sm opacity-80">
                  Prevents unauthorized access to your account
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
                <p className="font-medium">Receive important notifications</p>
                <p className="text-sm opacity-80">
                  Get updates about your transactions and account activity
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
                <p className="font-medium">Access all features</p>
                <p className="text-sm opacity-80">
                  Unlock all platform features after verification
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-sm opacity-80">
          &copy; {new Date().getFullYear()} LendenPay All rights reserved.
        </div>
      </div>

      {/* Right Column - Verification Status */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-full bg-primary-600 text-white flex items-center justify-center">
              <EnvelopeIcon className="h-8 w-8" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Email Verification
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {verificationStatus === "idle"
              ? "We're verifying your email address..."
              : verificationStatus === "success"
              ? "Your email has been successfully verified!"
              : "We encountered an issue while verifying your email."}
          </p>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-8">
              {verificationStatus === "idle" ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-6"></div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Verification in Progress
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    We're verifying the email address:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg w-full text-center mb-4 break-all">
                    <span className="font-medium text-gray-800">{email}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">
                    This may take a moment. Please don't close this page.
                  </p>

                  <Link
                    to="/login"
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Go to Login
                  </Link>
                </div>
              ) : verificationStatus === "success" ? (
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 rounded-full p-3 mb-6">
                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Verification Successful!
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    Thanks for verifying your email address. Your account is now
                    fully activated.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg w-full text-center mb-6 break-all">
                    <span className="font-medium text-gray-800">{email}</span>
                  </div>

                  {/* Add Agent Link Card if user data is available and user has agentId */}
                  {userData && userData.agentId && (
                    <div className="w-full mb-6">
                      <h4 className="text-base font-medium text-gray-800 mb-2">
                        Your Agent Portal Access
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        As a verified user, you now have access to your
                        dedicated agent portal. Use the link below to access
                        your portal or share it with others.
                      </p>
                      <AgentLinkCard
                        agentId={userData.agentId}
                        agentName={userData.fullName}
                        className="mb-2"
                      />
                      <p className="text-xs text-gray-500 italic">
                        Remember to save your Agent ID for future reference. You
                        can access your portal anytime via the link above.
                      </p>
                    </div>
                  )}

                  <p className="text-gray-500 text-sm mb-6">
                    You'll be redirected to the login page shortly.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Go to Login
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-red-100 rounded-full p-3 mb-6">
                    <ExclamationCircleIcon className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Verification Failed
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    We couldn't verify your email address. The verification link
                    may have expired or is invalid.
                  </p>
                  <div className="bg-red-50 border border-red-100 p-4 rounded-lg w-full text-center mb-6">
                    <span className="font-medium text-red-800">
                      {errorMessage ||
                        "Verification link is invalid or expired"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleManualVerify}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      disabled={verifyMutation.isPending}
                    >
                      {verifyMutation.isPending ? (
                        <>
                          <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                          Retrying...
                        </>
                      ) : (
                        "Try Again"
                      )}
                    </button>
                    <Link
                      to="/login"
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Go to Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <p className="text-gray-600">Ready to get started?</p>
              <Link
                to="/login"
                className="inline-flex justify-center items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Login to Your Account
              </Link>
            </div>
            <p className="text-gray-600 mt-6 mb-4">
              Need assistance or have questions?
            </p>
            <a
              href="mailto:support@lendenpay.com"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
