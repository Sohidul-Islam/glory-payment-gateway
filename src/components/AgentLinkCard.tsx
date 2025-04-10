import {
  ArrowRightIcon,
  UserCircleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

interface AgentLinkCardProps {
  agentId: string;
  agentName?: string;
  className?: string;
}

const AgentLinkCard = ({
  agentId,
  agentName,
  className = "",
}: AgentLinkCardProps) => {
  const [copied, setCopied] = useState(false);

  if (!agentId) return null;

  const copyAgentIdToClipboard = () => {
    navigator.clipboard.writeText(agentId).then(() => {
      setCopied(true);
      toast.success("Agent ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Create the full agent URL including the domain
  const agentUrl = `${window.location.origin}/agent/${agentId}`;

  return (
    <div
      className={`border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden ${className}`}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <UserCircleIcon className="h-7 w-7 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {agentName ? `${agentName}'s Portal` : "Agent Portal"}
            </h3>
            <div className="flex items-center mt-1">
              <p className="text-xs text-gray-500 mr-2">ID: {agentId}</p>
              <button
                onClick={copyAgentIdToClipboard}
                className="text-primary-600 hover:text-primary-700 focus:outline-none"
                title="Copy Agent ID"
              >
                <ClipboardIcon className="h-4 w-4" />
              </button>
              {copied && (
                <span className="text-xs text-green-600 ml-1">Copied!</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <div className="text-xs text-gray-600 font-medium mb-1">
            Share your agent link:
          </div>
          <div className="flex items-center text-sm bg-white p-2 rounded border border-gray-200 break-all">
            <span className="truncate text-xs flex-1">{agentUrl}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(agentUrl);
                toast.success("Agent URL copied to clipboard!");
              }}
              className="text-primary-600 hover:text-primary-700 ml-2 focus:outline-none"
            >
              <ClipboardIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p>Access your dedicated agent portal to:</p>
          <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
            <li>Manage payment methods</li>
            <li>Track transactions</li>
            <li>View your commission</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/agent/${agentId}`}
            className="flex-1 flex items-center justify-center py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Visit Portal
            <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
          </Link>

          <Link
            to="/login"
            className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentLinkCard;
