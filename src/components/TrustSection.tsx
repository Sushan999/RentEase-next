"use client";

import { Shield, Award, Clock, Users } from "lucide-react";
import Title from "./Title";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description:
      "Every property is verified and inspected for quality and safety",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Our customer support team is available around the clock to help",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description:
      "Find a lower price elsewhere? We'll match it and give you 10% off",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description: "Join over 10,000 satisfied guests who trust our platform",
  },
];

export function TrustSection() {
  return (
    <section className="py-16 bg-white flex justify-center items-center">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Title
            title=" Why Choose RentEase?"
            subtitle="We are committed to providing you with the best rental experience"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-2  lg:grid-cols-4 gap-2 lg:gap-6 px-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center  rounded-md border shadow-md cursor-pointer border-gray-50 py-8 lg:py-12 px-1 lg:px-4"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base ">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
