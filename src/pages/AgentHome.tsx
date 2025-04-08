import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AgentInfoResponse,
  getAgentInfo,
  getPaymentMethods,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import banner from "../assets/banner.jpg";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Store,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  CreditCard,
  Wallet,
} from "lucide-react";
import { formatDate } from "../utils/utils";
import { useParams, Link } from "react-router";

import noImage from "../assets/no-image-overlay.webp";

export const AgentHome = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const { agentId } = useParams();

  const { data: response, isLoading } = useQuery({
    queryKey: ["agentInfo", agentId],
    queryFn: () => getAgentInfo(agentId || ""),
    enabled: !!agentId,
  });

  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery(
    {
      queryKey: ["paymentMethods", agentId],
      queryFn: () => getPaymentMethods(),
      enabled: !!agentId,
    }
  );

  useEffect(() => {
    if (response?.Banners.length) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) =>
          prev === response.Banners.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [response?.Banners.length]);

  if (isLoading || isLoadingPaymentMethods) {
    return <Loader />;
  }

  if (!response) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Agent Information Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The agent information you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const agent = response as AgentInfoResponse["data"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Banner Carousel */}
      <div className="relative h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBannerIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={
                agent?.Banners[currentBannerIndex]?.image || banner || noImage
              }
              alt={agent?.Banners[currentBannerIndex]?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
              <div className="max-w-7xl mx-auto">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl font-bold mb-4"
                >
                  {agent?.Banners[currentBannerIndex]?.title}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl opacity-90 max-w-2xl mb-8"
                >
                  {agent?.Banners[currentBannerIndex]?.description}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to={`/payment/${agentId}`}
                    className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-lg"
                  >
                    Start Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Banner Navigation Dots */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {agent?.Banners?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentBannerIndex
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
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
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
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
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Agent Profile */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8"
            >
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      {agent.image ? (
                        <img
                          src={agent.image}
                          alt={agent.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-indigo-600" />
                      )}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${
                        agent.isVerified ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {agent.isVerified ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  <h1 className="text-2xl font-semibold mb-2">
                    {agent.fullName}
                  </h1>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium mb-6 ${
                      agent.accountStatus === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {agent.accountStatus}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span>{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span>{agent.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{agent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Building2 className="w-5 h-5" />
                    <span>{agent.businessName || "No Business Name"}</span>
                  </div>
                  {agent.businessType && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Store className="w-5 h-5" />
                      <span>{agent.businessType}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Member since {formatDate(agent.createdAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Payment Methods and Banners */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Methods Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Available Payment Methods
                    </h2>
                    <p className="text-gray-500 mt-1">
                      Choose your preferred payment option
                    </p>
                  </div>
                  <Link
                    to={`/payment/${agentId}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {paymentMethods?.map((method, index) => (
                    <motion.div
                      key={method.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="group cursor-pointer"
                    >
                      <div className="relative bg-white rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:scale-[1.02]">
                        {/* Decorative background elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                        {/* Payment method content */}
                        <div className="relative">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-white to-gray-50 p-2.5 shadow-sm flex items-center justify-center">
                            <img
                              src={method.image}
                              alt={method.name}
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>

                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 mb-2">
                              {method.name.replace("_", " ")}
                            </p>
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  method.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {method.status === "active" ? (
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                ) : (
                                  <XCircle className="w-3 h-3 mr-1" />
                                )}
                                {method.status}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                Instant
                              </span>
                            </div>
                          </div>

                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Active Banners Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {agent?.Banners?.map((banner, index) => (
                <motion.div
                  key={banner.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      {banner.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {banner.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(banner.startDate)} -{" "}
                        {formatDate(banner.endDate)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-600 text-sm">
                We provide secure and reliable payment solutions for businesses
                and individuals.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-gray-600 hover:text-indigo-600 text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-600 hover:text-indigo-600 text-sm"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-600 hover:text-indigo-600 text-sm"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-gray-600 hover:text-indigo-600 text-sm"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@example.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +1 234 567 890
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  123 Business Street
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2024 Payment Gateway. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};
