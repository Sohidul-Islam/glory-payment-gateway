import { motion } from "framer-motion";
import { CheckCircle2, XCircle, User, Phone, Mail } from "lucide-react";
import noImage from "../assets/no-image-overlay.webp";

interface AgentInfoProps {
  name: string;
  status: string;
  phone: string;
  email: string;
  agentId: string;
  image?: string;
  className?: string;
}

export const AgentInfo = ({
  name,
  status,
  phone,
  email,
  agentId,
  image,
  className = "",
}: AgentInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
            <img
              src={image || noImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              status === "active" ? "bg-green-500" : "bg-red-500"
            }`}
            animate={{
              scale: [1, 1.2, 1],
              transition: { duration: 1.5, repeat: Infinity },
            }}
          >
            {status === "active" ? (
              <CheckCircle2 className="w-3 h-3 text-white" />
            ) : (
              <XCircle className="w-3 h-3 text-white" />
            )}
          </motion.div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>ID: {agentId || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
