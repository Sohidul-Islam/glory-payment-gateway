import { useState } from "react";
import { InputField } from "./InputField";

interface PaymentMethodFormProps {
  initialData?: {
    name: string;
    description: string;
    logo?: string;
    isActive: boolean;
  };
  onSubmit: (data: FormData) => void;
}

export const PaymentMethodForm = ({
  initialData,
  onSubmit,
}: PaymentMethodFormProps) => {
  const [logo, setLogo] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    if (logo) {
      formData.append("logo", logo);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="Payment Method Name"
        name="name"
        defaultValue={initialData?.name}
        required
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          defaultValue={initialData?.description}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          defaultChecked={initialData?.isActive}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          Active
        </label>
      </div>

      <button type="submit" className="w-full btn-primary">
        {initialData ? "Update Payment Method" : "Add Payment Method"}
      </button>
    </form>
  );
};
