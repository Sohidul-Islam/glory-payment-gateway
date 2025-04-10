/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Copy,
  CheckCircle2,
  Link as LinkIcon,
  ExternalLink,
  Share2,
  RefreshCcw,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import AXIOS from "../../network/Axios";
import { toast } from "react-toastify";

export const AgentLinkCard = () => {
  const [copied, setCopied] = useState(false);
  const { user, refreshProfile } = useAuth();
  const [agentId, setAgentId] = useState(user?.agentId);
  const baseUrl = window.location.origin;
  const agentLink = `${baseUrl}/agent/${agentId || user?.agentId}`;

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

  const openLinkInNewTab = () => {
    window.open(agentLink, "_blank");
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

  const assignAgentId = useMutation({
    mutationFn: async (agentId?: string) => {
      const response = await AXIOS.post(`/assign-agentId/${user?.id || ""}`, {
        agentId,
      });

      return response;
    },
    onSuccess: (data) => {
      if (data?.status) {
        toast.success("Agent ID updated successfully");
        if (data?.data?.agentId) {
          refreshProfile();
          setAgentId(data.data.agentId);
        }
      } else {
        toast.error((data as any)?.message || "Failed to update Agent ID");
      }
    },
    onError: (error) => {
      toast.error("Failed to update Agent ID");
      console.error(error);
    },
  });

  const handleAgentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value.replace(" ", "-"); // Only allow numbers
    setAgentId(newId);
  };

  const generateAgentId = () => {
    setAgentId(agentId);
    assignAgentId.mutate(agentId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Payment Link
        </h2>
        <div className="flex items-center gap-2">
          {/* Mobile Share Button */}
          <button
            onClick={shareLink}
            className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={openLinkInNewTab}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 px-3 py-2"
          >
            <span className="hidden md:inline">Open</span>
            <ExternalLink className="w-4 h-4 md:ml-1" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
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
      </div>

      <div className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
        <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 hidden md:block" />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="text-sm text-gray-600 truncate font-mono">
            {agentLink}
          </div>
        </div>
        <button
          onClick={copyAgentLink}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
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
    </div>
  );
};
