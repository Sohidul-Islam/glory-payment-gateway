import { useState } from "react";
import {
  Copy,
  CheckCircle2,
  Link as LinkIcon,
  ExternalLink,
  Share2,
  UserPlus,
  CreditCard,
  // RefreshCcw,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import { toast } from "react-toastify";

export const AgentLinkCard = () => {
  const [copied, setCopied] = useState(false);
  const [registrationCopied, setRegistrationCopied] = useState(false);
  const [directPaymentCopied, setDirectPaymentCopied] = useState(false);
  const { user } = useAuth();
  const [agentId] = useState(user?.agentId);
  const baseUrl = window.location.origin;
  const agentLink = `${baseUrl}/agent/${agentId || user?.agentId}`;
  const registrationLink = `${baseUrl}/register?ref=${
    agentId || user?.agentId
  }`;
  const directPaymentLink = `${baseUrl}/agent/${
    agentId || user?.agentId
  }?paymentType=direct`;

  const copyAgentLink = async () => {
    try {
      await navigator.clipboard.writeText(agentLink);
      setCopied(true);
      toast.success("Payment link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log({ err });
      toast.error("Failed to copy link");
    }
  };

  const copyRegistrationLink = async () => {
    try {
      await navigator.clipboard.writeText(registrationLink);
      setRegistrationCopied(true);
      toast.success("Registration link copied to clipboard!");
      setTimeout(() => setRegistrationCopied(false), 2000);
    } catch (err) {
      console.log({ err });
      toast.error("Failed to copy registration link");
    }
  };

  const copyDirectPaymentLink = async () => {
    try {
      await navigator.clipboard.writeText(directPaymentLink);
      setDirectPaymentCopied(true);
      toast.success("Direct payment link copied to clipboard!");
      setTimeout(() => setDirectPaymentCopied(false), 2000);
    } catch (err) {
      console.log({ err });
      toast.error("Failed to copy direct payment link");
    }
  };

  const openLinkInNewTab = () => {
    window.open(agentLink, "_blank");
  };

  const openRegistrationLinkInNewTab = () => {
    window.open(registrationLink, "_blank");
  };

  const openDirectPaymentLinkInNewTab = () => {
    window.open(directPaymentLink, "_blank");
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Payment Link",
          text: "Here's my payment link",
          url: agentLink,
        });
        toast.success("Link shared successfully!");
      } catch (err) {
        console.log({ err });
        toast.error("Failed to share link");
      }
    } else {
      copyAgentLink();
    }
  };

  // const assignAgentId = useMutation({
  //   mutationFn: async (agentId?: string) => {
  //     const response = await AXIOS.post(`/assign-agentId/${user?.id || ""}`, {
  //       agentId,
  //     });

  //     return response;
  //   },
  //   onSuccess: (data) => {
  //     if (data?.status) {
  //       toast.success("Agent ID updated successfully");
  //       if (data?.data?.agentId) {
  //         refreshProfile();
  //         setAgentId(data.data.agentId);
  //       }
  //     } else {
  //       toast.error((data as any)?.message || "Failed to update Agent ID");
  //     }
  //   },
  //   onError: (error) => {
  //     toast.error("Failed to update Agent ID");
  //     console.error(error);
  //   },
  // });

  // const handleAgentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newId = e.target.value.replace(" ", "-"); // Only allow numbers
  //   setAgentId(newId);
  // };

  // const generateAgentId = () => {
  //   setAgentId(agentId);
  //   assignAgentId.mutate(agentId);
  // };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-lg mr-3">
            <LinkIcon className="w-5 h-5" />
          </span>
          Your Payment Link
        </h2>
        <div className="flex items-center gap-2">
          {/* Mobile Share Button */}
          <button
            onClick={shareLink}
            className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={openLinkInNewTab}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 px-3 py-2 transition-colors duration-200"
          >
            <span className="hidden md:inline">Open</span>
            <ExternalLink className="w-4 h-4 md:ml-1" />
          </button>
        </div>
      </div>
      {/* <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={agentId}
          onChange={handleAgentIdChange}
          placeholder="Enter Agent ID"
          className="flex-1 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 focus:outline-none"
        />
        <button
          onClick={generateAgentId}
          className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCcw
            className={`w-4 h-4 transition-transform duration-1000 ${
              assignAgentId.isPending ? "animate-spin" : ""
            }`}
          />
          Generate
        </button>
      </div> */}

      <div className="flex items-center gap-3 p-3 md:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 shadow-sm">
        <LinkIcon className="w-5 h-5 text-indigo-500 flex-shrink-0 hidden md:block" />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="text-sm text-gray-700 truncate font-mono">
            {agentLink}
          </div>
        </div>
        <button
          onClick={copyAgentLink}
          className="inline-flex items-center px-3 py-2 border border-indigo-200 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap transition-colors duration-200"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 md:mr-2 text-green-500" />
              <span className="hidden md:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Copy</span>
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-sm text-gray-500 hidden md:block">
        Share this link with your customers to accept payments. The link is
        unique to your account and can be used multiple times.
      </p>

      {/* Mobile-only shorter description */}
      <p className="mt-3 text-sm text-gray-500 md:hidden">
        Share this payment link with your customers.
      </p>

      {/* Registration Link Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-lg mr-3">
              <UserPlus className="w-5 h-5" />
            </span>
            Registration Link
          </h2>
          <button
            onClick={openRegistrationLinkInNewTab}
            className="inline-flex items-center text-sm text-green-600 hover:text-green-500 px-3 py-2 transition-colors duration-200"
          >
            <span className="hidden md:inline">Open</span>
            <ExternalLink className="w-4 h-4 md:ml-1" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 md:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 shadow-sm">
          <LinkIcon className="w-5 h-5 text-green-500 flex-shrink-0 hidden md:block" />
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="text-sm text-gray-700 truncate font-mono">
              {registrationLink}
            </div>
          </div>
          <button
            onClick={copyRegistrationLink}
            className="inline-flex items-center px-3 py-2 border border-green-200 shadow-sm text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 whitespace-nowrap transition-colors duration-200"
          >
            {registrationCopied ? (
              <>
                <CheckCircle2 className="w-4 h-4 md:mr-2 text-green-500" />
                <span className="hidden md:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Copy</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Share this link with potential users to register with your referral
          code.
        </p>
      </div>

      {/* Direct Payment Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-2 rounded-lg mr-3">
              <CreditCard className="w-5 h-5" />
            </span>
            Direct Payment Link
          </h2>
          <button
            onClick={openDirectPaymentLinkInNewTab}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 px-3 py-2 transition-colors duration-200"
          >
            <span className="hidden md:inline">Open</span>
            <ExternalLink className="w-4 h-4 md:ml-1" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 shadow-sm">
          <LinkIcon className="w-5 h-5 text-blue-500 flex-shrink-0 hidden md:block" />
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="text-sm text-gray-700 truncate font-mono">
              {directPaymentLink}
            </div>
          </div>
          <button
            onClick={copyDirectPaymentLink}
            className="inline-flex items-center px-3 py-2 border border-blue-200 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap transition-colors duration-200"
          >
            {directPaymentCopied ? (
              <>
                <CheckCircle2 className="w-4 h-4 md:mr-2 text-green-500" />
                <span className="hidden md:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Copy</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Share this link with customers for direct payments. The link is unique
          to your account.
        </p>
      </div>
    </div>
  );
};
