import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useSpring,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CommandLineIcon,
  CreditCardIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import heroIlustration from "../../src/assets/payment-illustration.png";
import bkash from "../../src/assets/gateway/Bkash-Logo.png";
import rocket from "../../src/assets/gateway/rocket.jpeg";
import upay from "../../src/assets/gateway/upay.png";
import nagad from "../../src/assets/gateway/nagad.png";
import cityBank from "../../src/assets/gateway/city bank.png";
import dbbl from "../../src/assets/gateway/dbbl.png";
import ab from "../../src/assets/gateway/ab bank.png";
import usdt from "../../src/assets/gateway/usdt.jpg";

// client logo
import client1 from "../../src/assets/client/Petapixel-Article-Images-5-800x600.webp";
import client2 from "../../src/assets/client/Ryan Kirk Surexdirect.jpg";
import client3 from "../../src/assets/client/client.jpeg";

import logo from "../../src/assets/logo.png";

// Add interfaces for our data types
interface PaymentMethod {
  name: string;
  logo: string;
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
}

interface PaymentMethodSliderProps {
  methods: PaymentMethod[];
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="h-[80px] rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='12' y1='8' x2='12' y2='16'%3E%3C/line%3E%3Cline x1='8' y1='12' x2='16' y2='12'%3E%3C/line%3E%3C/svg%3E";
                }}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Link
              to="/login"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section - Enhanced with more animations */}
      <div className="container mx-auto px-4 pt-16 pb-24 relative">
        {/* Decorative Elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full filter blur-3xl opacity-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          {/* Left Content - Enhanced with trust badges */}
          <div className="space-y-8 z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
            >
              Simplify Payments{" "}
              <span className="text-blue-600">for Smart Entrepreneurs</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-xl"
            >
              LendenPay BD Making Payments Easy for Smart Entrepreneurs in
              Bangladesh.
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              {trustBadges.map((badge) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  {badge.text}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/register"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors hover:border-blue-500 hover:text-blue-600"
              >
                View Pricing
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Enhanced Illustration */}
          <div className="relative">
            <AnimatedHeroImage />

            {/* Enhanced Floating Elements */}
            {floatingElements.map((element, index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, element.float, 0],
                  x: element.sway ? [0, element.sway, 0] : 0,
                }}
                transition={{
                  duration: element.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className={`absolute ${element.position} ${element.size} ${element.color} rounded-full opacity-20`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600">
              Get started with LendenPay BD in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 relative z-10">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-blue-400"
                  >
                    <ArrowRightIcon />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced with hover effects */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-4"
          >
            Amazing Features by LendenPay BD
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
          >
            Discover powerful features designed to streamline your payment
            processes
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Supported Payment Methods
            </h2>
            <p className="text-gray-600">
              Choose from a wide range of popular payment methods in Bangladesh
            </p>
          </motion.div>
          <PaymentMethodSlider methods={paymentMethods} />
        </div>
      </section>

      {/* Stats Section - Enhanced with animations */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-gray-600">
              Your security is our top priority. We implement multiple layers of
              protection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Steps Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Easy Integration Process
            </h2>
            <p className="text-gray-600">
              Get started with LendenPay BD in just a few simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {integrationSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-8 mb-12"
              >
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <div className="bg-gray-100 rounded-xl p-4 aspect-video flex items-center justify-center">
                    {step.image}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">See It in Action</h2>
            <p className="text-gray-400">
              Experience how LendenPay BD works with our interactive demo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                {demoFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  Try Demo
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  View Docs
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <pre className="text-sm font-mono">
                    <code className="text-blue-400">
                      {`const payment = await LendenPay.createPayment({
                        amount: 1000,
                        currency: 'BDT',
                        method: 'bkash',
                        description: 'Order #123'
                      });

                      // Payment successful!
                      console.log(payment.status); // 'completed'
                      console.log(payment.id); // 'pay_123abc'`}
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            What Our Clients Say
          </motion.h2>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">About Us</h4>
              <p className="text-sm">
                LendenPay BD is a leading payment solution provider in
                Bangladesh, helping entrepreneurs manage their payments
                efficiently.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@lendenpaybd.com</li>
                <li>Phone: +880 1234-567890</li>
                <li>Address: Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} LendenPay BD. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Trust badges data
const trustBadges = [
  { text: "SSL Secured Payment" },
  { text: "24/7 Support" },
  { text: "Instant Setup" },
];

// Floating elements data
const floatingElements = [
  {
    position: "top-10 right-10",
    size: "w-16 h-16",
    color: "bg-blue-500",
    float: -20,
    duration: 4,
  },
  {
    position: "bottom-10 left-10",
    size: "w-12 h-12",
    color: "bg-indigo-500",
    float: 20,
    duration: 3,
  },
  {
    position: "top-32 left-20",
    size: "w-8 h-8",
    color: "bg-purple-500",
    float: -15,
    sway: 10,
    duration: 5,
  },
];

// Steps data
const steps = [
  {
    title: "Create Account",
    description:
      "Sign up for free and complete your business profile in minutes.",
  },
  {
    title: "Connect Payment Methods",
    description: "Add your preferred payment methods and verify your account.",
  },
  {
    title: "Start Accepting Payments",
    description: "Begin receiving payments from your customers instantly.",
  },
];

// Payment methods data
const paymentMethods = [
  { name: "bKash", logo: bkash },
  { name: "Nagad", logo: nagad },
  { name: "Rocket", logo: rocket },
  { name: "Upay", logo: upay },
  { name: "City Bank", logo: cityBank },
  { name: "DBBL", logo: dbbl },
  { name: "AB Bank", logo: ab },
  { name: "USDT", logo: usdt },
  { name: "bKash", logo: bkash },
  { name: "Nagad", logo: nagad },
  { name: "Rocket", logo: rocket },
  { name: "Upay", logo: upay },
  { name: "City Bank", logo: cityBank },
  { name: "DBBL", logo: dbbl },
  { name: "AB Bank", logo: ab },
  { name: "USDT", logo: usdt },
  { name: "City Bank", logo: cityBank },
  { name: "DBBL", logo: dbbl },
];

// Testimonials data
const testimonials = [
  {
    name: "Rahman Ahmed",
    role: "E-commerce Owner",
    avatar: client1,
    content:
      "LendenPay BD has transformed how we handle payments. The integration was seamless, and our customers love the easy payment process.",
  },
  {
    name: "Fatima Khan",
    role: "Startup Founder",
    avatar: client2,
    content:
      "The automated payment system has saved us countless hours. The customer support team is always there when we need them.",
  },
  {
    name: "Kamal Hassan",
    role: "Business Manager",
    avatar: client3,
    content:
      "Best payment gateway in Bangladesh! The features are exactly what we needed, and the pricing is very competitive.",
  },
];

// Feature data
const features = [
  {
    title: "Simple Integration System",
    description:
      "Easy integration with your existing systems with one-click access, automatic setup, and well-documented APIs.",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Automatic Payment Account",
    description:
      "Automatically create and manage payment accounts with secure handling and instant verification.",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Invoice Generator",
    description:
      "Generate professional invoices automatically with customized payment links through email.",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

// Stats data
const stats = [
  {
    value: "1,001+",
    label: "Daily Transactions",
  },
  {
    value: "1,000+",
    label: "Merchants",
  },
  {
    value: "21+",
    label: "Payment Methods",
  },
  {
    value: "10,000৳",
    label: "Daily Transaction Value",
  },
];

// Security Features data
const securityFeatures = [
  {
    title: "PCI DSS Compliant",
    description:
      "We maintain the highest level of payment security standards to protect your transactions.",
    icon: <ShieldCheckIcon className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "End-to-End Encryption",
    description:
      "All sensitive data is encrypted using industry-standard protocols.",
    icon: <GlobeAltIcon className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Real-time Fraud Detection",
    description:
      "Advanced AI-powered system to prevent fraudulent transactions.",
    icon: <ChartBarIcon className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Secure Authentication",
    description: "Multi-factor authentication and biometric security options.",
    icon: <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "24/7 Monitoring",
    description:
      "Continuous monitoring of all transactions for suspicious activities.",
    icon: <ClockIcon className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Instant Notifications",
    description:
      "Get real-time alerts for all account activities and transactions.",
    icon: <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />,
  },
];

// Integration Steps data
const integrationSteps = [
  {
    title: "Create Your Account",
    description:
      "Sign up for LendenPay BD and verify your business details. Our team will guide you through the process.",
    tags: ["Quick Setup", "24/7 Support", "Free Registration"],
    image: (
      <svg
        className="w-full h-full text-blue-600 opacity-75"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
  },
  {
    title: "Integrate Our API",
    description:
      "Use our well-documented API to integrate payment functionality into your application.",
    tags: ["REST API", "SDK Support", "Documentation"],
    image: (
      <svg
        className="w-full h-full text-blue-600 opacity-75"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Start Accepting Payments",
    description:
      "Begin accepting payments from your customers through multiple payment methods.",
    tags: ["Multiple Methods", "Instant Setup", "Real-time Dashboard"],
    image: (
      <svg
        className="w-full h-full text-blue-600 opacity-75"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

// Demo Features data
const demoFeatures = [
  {
    title: "Simple API Integration",
    description: "Just a few lines of code to start accepting payments",
    icon: <CommandLineIcon className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Multiple Payment Methods",
    description: "Support for all major payment methods in Bangladesh",
    icon: <CreditCardIcon className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Real-time Dashboard",
    description: "Monitor transactions and analytics in real-time",
    icon: <ChartBarIcon className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Automated Reconciliation",
    description: "Automatic matching of payments with orders",
    icon: <ArrowPathIcon className="w-5 h-5 text-blue-400" />,
  },
];

// Add these new components before the Home component
const PaymentMethodSlider: React.FC<PaymentMethodSliderProps> = ({
  methods,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(methods.length / itemsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalPages]);

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {methods
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((method: PaymentMethod, index: number) => (
              <motion.div
                key={`${method.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center"
              >
                <div className="h-12 w-24 bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="h-10 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600">{method.name}</span>
              </motion.div>
            ))}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }).map((_, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentPage === index ? "bg-blue-600 w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative overflow-hidden px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mb-6 border-4 border-white shadow-xl">
            <img
              src={testimonials[currentIndex].avatar}
              alt={testimonials[currentIndex].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
              }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 italic mb-6"
          >
            "{testimonials[currentIndex].content}"
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-lg">
              {testimonials[currentIndex].name}
            </h4>
            <p className="text-gray-600">{testimonials[currentIndex].role}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center mt-8 gap-2">
        {testimonials.map((_, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-blue-600 w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Add this new component before the Home component
const AnimatedCounter: React.FC<{
  value: string;
  label: string;
  index: number;
}> = ({ value, label, index }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, parseInt(value.replace(/[^0-9]/g, "")), {
      duration: 2,
      delay: index * 0.2,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="space-y-2"
    >
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="text-4xl font-bold"
      >
        <motion.span>{rounded}</motion.span>
        {value.includes("+") && "+"}
        {value.includes("৳") && "৳"}
      </motion.div>
      <div className="text-blue-100">{label}</div>
    </motion.div>
  );
};

// Add this new component before the Home component
const AnimatedHeroImage: React.FC = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const springConfig = { damping: 15, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="relative z-10"
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
        }}
        className="w-full aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center"
      >
        <img
          src={heroIlustration}
          alt="Payment Illustration"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.classList.add("bg-gray-100");
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Home;
