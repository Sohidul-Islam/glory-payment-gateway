/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { User } from "../network/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../network/services";
import { Input } from "./ui/Input";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserEditModal = ({ isOpen, onClose, user }: UserEditModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        businessName: user.businessName,
        businessType: user.businessType,
        accountStatus: user.accountStatus,
        accountType: user.accountType,
        commission: user.commission,
        commissionType: user.commissionType,
      });
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
      }
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to update user");
      setIsSubmitting(false);
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

                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Commission Settings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="commission"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Commission Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <Input
                            type="text"
                            id="commission"
                            name="commission"
                            value={formData.commission || ""}
                            onChange={handleChange}
                            className="block w-full  rounded-md border-gray-300 pl-3 pr-12 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="0.00"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center">
                            <select
                              id="commissionType"
                              name="commissionType"
                              value={formData.commissionType || ""}
                              onChange={handleChange}
                              className="h-full border p-2 rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            >
                              <option value="percentage">%</option>
                              <option value="fixed">Fixed</option>
                            </select>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {formData.commissionType === "percentage"
                            ? "Percentage of transaction amount"
                            : "Fixed amount per transaction"}
                        </p>
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
