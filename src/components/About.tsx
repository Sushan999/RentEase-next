"use client";
import Title from "./Title";
import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className=" bg-gray-50" id="about">
      <div className="flex flex-col items-center justify-center container mx-auto p-10 md:px-20 lg:px-32 w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Title
            title="Our Brand"
            subtitle=" Passionate About Properties, Dedicated to your Vision"
          />
        </motion.div>

        <div className="flex flex-col md:flex-row items-center md:items-start md:gap-20 mt-8">
          <Image
            src="/brand_img.png"
            alt="Our Brand"
            width={600}
            height={400}
            className="w-full sm:w-1/2 max-w-lg"
            style={{ objectFit: "cover" }}
            priority={true}
          />

          <div className="flex flex-col items-center md:items-start mt-10 text-gray-600">
            <motion.div
              className="grid grid-cols-2 gap-6 md:gap-10 w-full 2xl:pr-28"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-3xl md:text-4xl font-medium text-gray-800">
                  10+
                </p>
                <p className="text-sm">Years of Excellence</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <p className="text-3xl font-medium text-gray-800">12+</p>
                <p className="text-sm">Projects Completed</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="text-3xl font-medium text-gray-800">20+</p>
                <p className="text-sm">Mn. Sq. Ft. Delivered</p>
              </motion.div>

              <motion.div
                className="text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <p className="text-3xl font-medium text-gray-800">25+</p>
                <p>Ongoing Projects</p>
              </motion.div>
            </motion.div>

            <motion.p
              className="text-sm md:text-base my-10 max-w-lg text-justify"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industrys standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book
            </motion.p>

            <motion.button
              className="bg-blue-600 text-white px-8 py-2 rounded"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn more
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
