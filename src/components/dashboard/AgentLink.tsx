import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface AgentLinkProps {
  agentId: number;
}

export const AgentLink = ({ agentId }: AgentLinkProps) => {
  const [copied, setCopied] = useState(false);
  const baseUrl = window.location.origin;
  const agentLink = `${baseUrl}/agent/${agentId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(agentLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Your Payment Link
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={agentLink}
          className="flex-1 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 focus:outline-none"
        />
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Share this link with your customers to accept payments
      </p>
    </div>
  );
};
