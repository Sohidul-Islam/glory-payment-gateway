import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import noImage from "../assets/no-image-overlay.webp";

const PaymentMethods = () => {
  const [methods] = useState([
    { id: 1, name: "bKash", logo: "/logos/bkash.png", status: "active" },
    { id: 2, name: "Nagad", logo: "/logos/nagad.png", status: "active" },
    // Add more methods
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Payment Methods</h1>
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add New Method
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((method) => (
          <div
            key={method.id}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={noImage}
                alt={method.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="font-medium">{method.name}</h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    method.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {method.status}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-primary text-sm">Edit</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
