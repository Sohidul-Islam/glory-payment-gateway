/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  PhotoIcon,
  ArrowPathIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { User } from "../network/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../network/services";
import { Input } from "./ui/Input";
import { uploadFile } from "../utils/utils";
import { toast } from "react-hot-toast";
import AXIOS from "../network/Axios";
import { useAuth } from "../hooks/useAuth";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserEditModal = ({ isOpen, onClose, user }: UserEditModalProps) => {
  const queryClient = useQueryClient();

  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    agentId: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    businessName: "",
    businessType: "",
    accountType: "",
    accountStatus: "",
    commission: "",
    commissionType: "",
    agentCommission: "",
    agentCommissionType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGeneratingAgentId, setIsGeneratingAgentId] = useState(false);
  const [agentIdCopied, setAgentIdCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        agentId: user.agentId || "",
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        location: user.location || "",
        businessName: user.businessName || "",
        businessType: user.businessType || "",
        accountType: user.accountType || "",
        accountStatus: user.accountStatus || "",
        commission: user.commission || "",
        commissionType: user.commissionType || "",
        agentCommission: user.agentCommission || "",
        agentCommissionType: user.agentCommissionType || "",
      });

      // Set image preview if user has an image
      if (user.image) {
        setImagePreview(user.image);
      }
    }
  }, [user]);

  const updateUserMutation = useMutation({
    mutationFn: (data: { id: number; userData: Partial<User> }) =>
      updateUser(data.id, data.userData),
    onSuccess: (data: any) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setSuccess("User updated successfully!");
        setTimeout(() => {
          onClose();
          setIsSubmitting(false);
        }, 1500);
      } else {
        setError(data.message);
        setIsSubmitting(false);
      }
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to update user");
      setIsSubmitting(false);
    },
  });

  const generateAgentIdMutation = useMutation({
    mutationFn: async (agentId?: string) => {
      const response = await AXIOS.post(`/assign-agentId/${user?.id || ""}`, {
        agentId,
      });

      return response;
    },
    onSuccess: (data) => {
      if (data && data?.data?.agentId) {
        setFormData((prev) => ({ ...prev, agentId: data?.data?.agentId }));
        toast.success("New Agent ID generated successfully");
      } else {
        toast.error("Failed to generate Agent ID");
      }
      setIsGeneratingAgentId(false);
    },
    onError: () => {
      toast.error("Failed to generate Agent ID");
      setIsGeneratingAgentId(false);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      // Create a preview URL
      const previewUrl = await uploadFile(file);
      setImagePreview(previewUrl);

      setFormData((prev) => ({ ...prev, image: previewUrl }));
      // Convert image to base64 for API submission
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateAgentId = () => {
    setIsGeneratingAgentId(true);
    generateAgentIdMutation.mutate(formData.agentId);
  };

  const copyAgentIdToClipboard = () => {
    if (formData.agentId) {
      navigator.clipboard.writeText(formData.agentId);
      setAgentIdCopied(true);
      toast.success("Agent ID copied to clipboard!");
      setTimeout(() => setAgentIdCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    updateUserMutation.mutate({
      id: user.id,
      userData: formData,
    });
  };

  if (!user) return null;

  const agentUrl = `${window.location.origin}/agent/${formData.agentId}`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Edit User: {user.fullName}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Profile Picture Section */}
                  <div className="flex flex-col items-center mb-6">
                    <div
                      className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer group"
                      onClick={handleImageClick}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <PhotoIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium">
                          Change Photo
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Click to change profile picture
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <Input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <Input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Location
                      </label>
                      <Input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="businessName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Business Name
                      </label>
                      <Input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="businessType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Business Type
                      </label>
                      <Input
                        type="text"
                        id="businessType"
                        name="businessType"
                        value={formData.businessType || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="accountType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Account Type
                      </label>
                      <select
                        id="accountType"
                        name="accountType"
                        value={formData.accountType || ""}
                        onChange={handleChange}
                        className="mt-1 block border p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      >
                        <option value="super admin">Super Admin</option>
                        <option value="agent">Agent</option>
                        <option value="default">Default</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="accountStatus"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Account Status
                      </label>
                      <select
                        id="accountStatus"
                        name="accountStatus"
                        value={formData.accountStatus || ""}
                        onChange={handleChange}
                        className="mt-1 border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Agent ID Section */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Agent Portal Settings
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label
                          htmlFor="agentId"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Agent ID
                        </label>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-grow">
                            <Input
                              type="text"
                              id="agentId"
                              name="agentId"
                              value={formData?.agentId || ""}
                              onChange={handleChange}
                              disabled={
                                currentUser?.accountType !== "super admin"
                              }
                              className="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="Agent ID"
                            />
                            <div>
                              {formData?.agentId && (
                                <button
                                  type="button"
                                  onClick={copyAgentIdToClipboard}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                  title="Copy Agent ID"
                                >
                                  <ClipboardIcon className="h-4 w-4" />
                                  {agentIdCopied && (
                                    <span className="absolute text-xs text-green-600 whitespace-nowrap -bottom-5 right-0">
                                      Copied!
                                    </span>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleGenerateAgentId}
                            disabled={
                              isGeneratingAgentId ||
                              currentUser?.accountType !== "super admin"
                            }
                            className="flex-shrink-0 inline-flex items-center justify-center h-10 px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                          >
                            {isGeneratingAgentId ? (
                              <>
                                <ArrowPathIcon className="animate-spin h-4 w-4 mr-1.5" />
                                <span>Generating...</span>
                              </>
                            ) : (
                              <>
                                <ArrowPathIcon className="h-4 w-4 mr-1.5" />
                                <span>Generate</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Used for agent portal access and referrals. Leave
                          empty for non-agent users.
                          {formData.agentId && (
                            <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
                              <span className="font-medium text-gray-700">
                                Agent Portal URL:
                              </span>
                              <div className="flex items-center mt-1">
                                <a
                                  href={agentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary-600 hover:text-primary-700 hover:underline truncate mr-1 flex-1"
                                >
                                  {agentUrl}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(agentUrl);
                                    toast.success(
                                      "Agent URL copied to clipboard!"
                                    );
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                  title="Copy URL"
                                >
                                  <ClipboardIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Charges Settings
                    </h4>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="commission"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Admin Charges
                        </label>
                        <input
                          type="text"
                          name="commission"
                          id="commission"
                          disabled={currentUser?.accountType !== "super admin"}
                          value={formData.commission}
                          onChange={handleChange}
                          className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="commissionType"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Commission Type
                        </label>
                        <select
                          id="commissionType"
                          name="commissionType"
                          value={formData.commissionType}
                          disabled={currentUser?.accountType !== "super admin"}
                          onChange={handleChange}
                          className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Select Type</option>
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="agentCommission"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Agent Commission Amount
                        </label>
                        <input
                          type="text"
                          name="agentCommission"
                          id="agentCommission"
                          disabled={currentUser?.accountType !== "super admin"}
                          value={formData.agentCommission}
                          onChange={handleChange}
                          className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="agentCommissionType"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Agent Commission Type
                        </label>
                        <select
                          id="agentCommissionType"
                          name="agentCommissionType"
                          value={formData.agentCommissionType}
                          disabled={currentUser?.accountType !== "super admin"}
                          onChange={handleChange}
                          className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Select Type</option>
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserEditModal;
