import { useState } from "react";
import { Copy, CheckCircle2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export const AgentLinkCard = () => {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const baseUrl = window.location.origin;
  const agentLink = `${baseUrl}/agent/${user?.id}`;

  const copyAgentLink = async () => {
    try {
      await navigator.clipboard.writeText(agentLink);
      setCopied(true);
      toast.success("Payment link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const openLinkInNewTab = () => {
    window.open(agentLink, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Payment Link</h2>
        <button
          onClick={openLinkInNewTab}
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
        >
          Open <ExternalLink className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-600 truncate font-mono">
            {agentLink}
          </div>
        </div>
        <button
          onClick={copyAgentLink}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Share this link with your customers to accept payments. The link is unique to your account and can be used multiple times.
      </p>
    </div>
  );
}; 