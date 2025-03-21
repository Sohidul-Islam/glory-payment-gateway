import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAgentPaymentTypes,
  updatePaymentTypeDescription,
  PaymentType,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import { useState, useEffect } from "react";
import Editor from "react-simple-wysiwyg";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Save } from "lucide-react";

const PaymentNotes = () => {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<PaymentType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");

  const { data: paymentTypes, isLoading } = useQuery({
    queryKey: ["adminPaymentTypes"],
    queryFn: () => getAgentPaymentTypes(1, "1"), // Using dummy values for admin
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: async ({
      typeId,
      description,
    }: {
      typeId: number;
      description: string;
    }) => {
      return updatePaymentTypeDescription(typeId, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPaymentTypes"] });
      setIsSaving(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  const handleSave = async () => {
    if (!selectedType) return;

    setIsSaving(true);
    updateDescriptionMutation.mutate({
      typeId: selectedType.id,
      description: content,
    });
  };

  const handleTypeSelect = (type: PaymentType) => {
    setSelectedType(type);
    setContent(type.description || "");
  };

  // Initialize editor with default content when type is selected
  useEffect(() => {
    if (selectedType?.description) {
      setContent(selectedType.description);
    }
  }, [selectedType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Payment Notes</h1>
            <p className="text-gray-500 mt-1">
              Manage payment type descriptions and notes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Payment Types List */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Types
              </h2>
              <div className="space-y-2">
                {paymentTypes?.map((type) => (
                  <motion.button
                    key={type.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleTypeSelect(type)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      selectedType?.id === type.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 flex items-center justify-center overflow-hidden p-2">
                          <img
                            src={type.image}
                            alt={type.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            type.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {type.status === "active" ? (
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                          ) : (
                            <XCircle className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {type.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            type.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {type.status}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Editor Section */}
            <div className="lg:col-span-2">
              {selectedType ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Edit Notes
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </motion.button>
                  </div>
                  <div className="prose max-w-none">
                    <Editor
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                      }}
                      title=""
                      className="min-h-[400px] p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
                      containerProps={{
                        style: {
                          height: "400px",
                          overflow: "auto",
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a payment type to edit its notes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentNotes;
