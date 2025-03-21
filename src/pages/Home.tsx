import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { PaymentMethod, getPaymentMethods } from "../network/services";
import { Loader } from "../components/ui/Loader";
import {
  Shield,
  CreditCard,
  Wallet,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const Home = () => {
  const { agentId } = useParams();

  const navigator = useNavigate();

  const { data: paymentMethods, isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["paymentMethods", agentId],
    queryFn: () => getPaymentMethods(),
    enabled: !!agentId,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Secure Payment Gateway
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
              Make secure payments through our trusted agent network. Fast,
              reliable, and protected transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payments</h3>
                <p className="text-sm text-gray-600">
                  Protected by industry-leading security
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Multiple Methods
                </h3>
                <p className="text-sm text-gray-600">
                  Choose your preferred payment option
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Instant Processing
                </h3>
                <p className="text-sm text-gray-600">
                  Quick and efficient transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Available Payment Methods
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose from our wide range of secure payment options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods?.map((method) => (
            <div
              key={method.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={method.image}
                    alt={method.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {method.name}
                      </h3>
                      {method.status === "active" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        navigator(`/payment/${agentId}/method/${method.id}`);
                      }}
                      className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Pay with {method.name}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Glory Payment Gateway. All
              rights reserved.
            </p>
            <p className="mt-2">Secure • Reliable • Fast</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
