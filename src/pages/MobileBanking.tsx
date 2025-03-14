import { useState } from "react";
import { Card } from "../components/ui/Card";
import { PlusIcon } from "@heroicons/react/24/outline";

interface BankingOption {
  id: number;
  name: string;
  operations: string[];
  fees: { [key: string]: number };
}

const MobileBanking = () => {
  const [providers] = useState<BankingOption[]>([
    {
      id: 1,
      name: "bKash",
      operations: ["Send Money", "Cash Out", "Make Payment"],
      fees: {
        "Send Money": 5,
        "Cash Out": 18.5,
        "Make Payment": 0,
      },
    },
    // Add more providers
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mobile Banking</h1>
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Provider
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="p-6">
            <h3 className="text-lg font-medium">{provider.name}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Operations
                </h4>
                <ul className="mt-2 space-y-2">
                  {provider.operations.map((op) => (
                    <li key={op} className="flex justify-between text-sm">
                      <span>{op}</span>
                      <span className="text-gray-500">
                        Fee: ৳{provider.fees[op]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-sm">Edit</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Configure
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MobileBanking;
