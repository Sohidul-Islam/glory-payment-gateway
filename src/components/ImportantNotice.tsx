import React from "react";
import { motion } from "framer-motion";

type NoticeType = "deposit" | "withdraw";
export type PaymentType = "MOBILE_BANKING" | "BANK" | "USDT";

interface ImportantNoticeProps {
  type: NoticeType;
  paymentType: PaymentType;
}

const ImportantNotice: React.FC<ImportantNoticeProps> = ({
  type,
  paymentType,
}) => {
  const getNoticeContent = () => {
    if (paymentType === "MOBILE_BANKING") {
      return {
        title: "গুরুত্বপূর্ণ নোটিশ - মোবাইল ব্যাংকিং",
        description:
          type === "deposit"
            ? "মোবাইল ব্যাংকিংয়ের মাধ্যমে জমার ক্ষেত্রে নিম্নলিখিত নির্দেশনাগুলো অনুসরণ করুন:"
            : "মোবাইল ব্যাংকিংয়ের মাধ্যমে উত্তোলনের ক্ষেত্রে নিম্নলিখিত বিষয়গুলো মেনে চলুন:",
        points:
          type === "deposit"
            ? [
                "সঠিক মোবাইল ব্যাংকিং অপশন (বিকাশ, নগদ ইত্যাদি) নির্বাচন করুন।",
                "টাকা পাঠানোর পর রেফারেন্স নম্বর সঠিকভাবে প্রদান করুন।",
                "লেনদেনের স্লিপ সংরক্ষণ করুন এবং আপলোড করুন।",
              ]
            : [
                "উত্তোলনের জন্য সঠিক নম্বর এবং তথ্য দিন।",
                "উত্তোলনের পর লেনদেনের স্লিপ সংরক্ষণ করুন।",
                "যেকোনো সমস্যা হলে দ্রুত কাস্টমার কেয়ার-এর সাথে যোগাযোগ করুন।",
              ],
        warning:
          "নোটিশ: শুধুমাত্র অফিসিয়াল মোবাইল নম্বরে লেনদেন করুন, তৃতীয় পক্ষের নম্বরে নয়।",
      };
    }

    if (paymentType === "USDT") {
      return {
        title: "গুরুত্বপূর্ণ নোটিশ - USDT লেনদেন",
        description:
          type === "deposit"
            ? "USDT ডিপোজিট করার সময় নিচের নির্দেশনাগুলো অনুসরণ করুন:"
            : "USDT উত্তোলনের সময় নিচের বিষয়গুলো খেয়াল রাখুন:",
        points:
          type === "deposit"
            ? [
                "TRC20 নেটওয়ার্ক ব্যবহার করে পাঠান।",
                "লেনদেন আইডি (TXID) সঠিকভাবে প্রদান করুন।",
                "প্রমাণস্বরূপ স্ক্রিনশট সংরক্ষণ করুন।",
              ]
            : [
                "উত্তোলনের ঠিকানা (wallet address) সঠিকভাবে দিন।",
                "TRC20 সাপোর্ট করে এমন ওয়ালেট ব্যবহার করুন।",
                "উত্তোলনের সময় ন্যূনতম পরিমাণ বজায় রাখুন।",
              ],
        warning:
          "নোটিশ: ভুল ওয়ালেট ঠিকানায় প্রেরিত অর্থ ফেরতযোগ্য নয়। সঠিকভাবে যাচাই করে তথ্য দিন।",
      };
    }

    // Default for bank
    return {
      title: "গুরুত্বপূর্ণ নোটিশ - ব্যাংক লেনদেন",
      description:
        type === "deposit"
          ? "ব্যাংকের মাধ্যমে জমার ক্ষেত্রে নিচের নির্দেশনাগুলো মেনে চলুন:"
          : "ব্যাংকের মাধ্যমে উত্তোলনের সময় নিচের নির্দেশনাগুলো অনুসরণ করুন:",
      points:
        type === "deposit"
          ? [
              "সঠিক ব্যাংক এবং শাখা ব্যবহার করুন।",
              "অ্যাকাউন্ট নাম এবং নম্বর নির্ভুলভাবে দিন।",
              "লেনদেনের স্লিপ সংরক্ষণ করুন।",
            ]
          : [
              "উত্তোলনের জন্য ব্যাংক তথ্য সঠিকভাবে দিন।",
              "ব্যালেন্স পর্যাপ্ত আছে কিনা নিশ্চিত করুন।",
              "উত্তোলনের রেকর্ড সংরক্ষণ করুন।",
            ],
      warning:
        "নোটিশ: ব্যাংক লেনদেনের সময় কর্মঘণ্টা ও ছুটির দিন বিবেচনায় রাখুন।",
    };
  };

  const content = getNoticeContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-lg sm:text-xl font-bold text-orange-600">
              !
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-orange-900 mb-2">
              {content.title}
            </h3>
            <div className="space-y-3 sm:space-y-4 text-orange-800">
              <p className="text-xs sm:text-sm">{content.description}</p>
              <div className="space-y-2 sm:space-y-3">
                {content.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-orange-600">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm">{point}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-orange-100 rounded-lg border border-orange-200">
                <p className="text-xs sm:text-sm font-medium text-orange-900">
                  {content.warning}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImportantNotice;
