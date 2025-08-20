"use client";

import { Home, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Particles } from "@/components/magicui/particles";

export function HeroSection() {
  return (
    <section className="min-h-[90vh] md:min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={150}
        ease={80}
        color="#2563eb"
        size={0.23}
        refresh
      />

      <div className="max-w-4xl mx-auto text-center space-y-8 mt-32 md:mt-24 relative z-10">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl md:text-7xl text-slate-900 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Your
            <motion.span
              className="block font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Perfect Home
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Discover exceptional properties in prime locations
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/properties"
              className="bg-blue-600 text-white rounded-md shadow-md px-8 py-4 hover:bg-blue-800 cursor-pointer inline-block"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className=" grid-cols-1 sm:grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto hidden md:grid mt-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {[
            { icon: Home, number: "1000+", label: "Properties" },
            { icon: MapPin, number: "50+", label: "Cities" },
            { icon: Clock, number: "24/7", label: "Support" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl sm:text-3xl text-slate-900">
                {stat.number}
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="md:hidden flex justify-between px-4 mt-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {[
            { icon: Home, number: "1000+", label: "Properties" },
            { icon: MapPin, number: "50+", label: "Cities" },
            { icon: Clock, number: "24/7", label: "Support" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center space-y-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
            >
              <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-3" />
              <div className="text-xl sm:text-3xl text-slate-900">
                {stat.number}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="pt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full mx-auto relative">
            <div className="w-1 h-3 bg-slate-400 rounded-full mx-auto mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
