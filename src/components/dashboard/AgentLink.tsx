import { useState } from "react";
import { Copy, CheckCircle2, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";

interface AgentLinkProps {
  initialAgentId?: number;
}

export const AgentLink = ({ initialAgentId = 1000 }: AgentLinkProps) => {
  const [copied, setCopied] = useState(false);
  const [agentId, setAgentId] = useState(initialAgentId);
  const baseUrl = window.location.origin;
  const agentLink = `${baseUrl}/agent/${agentId}`;
  const registerLink = `${baseUrl}/register?ref=${agentId}`;

  const generateAgentId = () => {
    const newAgentId = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit ID
    setAgentId(newAgentId);
  };

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error(err);
    }
  };

  const handleAgentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value.replace(/\D/g, ""); // Only allow numbers
    setAgentId(Number(newId) || 0);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Your Payment Link
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            readOnly
            value={agentLink}
            className="flex-1 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 focus:outline-none"
          />
          <button
            onClick={() => copyToClipboard(agentLink)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
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
            <RefreshCcw className="w-4 h-4" />
            Generate
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          You can manually enter an Agent ID or generate one. Share this link
          with your customers to accept payments.
        </p>
      </div>

      {/* Register Link */}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Your Register Link
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            readOnly
            value={registerLink}
            className="flex-1 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 focus:outline-none"
          />
          <button
            onClick={() => copyToClipboard(registerLink)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
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
            <RefreshCcw className="w-4 h-4" />
            Generate
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          You can manually enter an Agent ID or generate one. Share this link
          with your customers to accept payments.
        </p>
      </div>
    </div>
  );
};
