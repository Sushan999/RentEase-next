import { Shield, Award, Clock, Users } from "lucide-react";
import Title from "./Title";

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
        <div className="text-center mb-12">
          {/* <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Why Choose RentEase?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are committed to providing you with the best rental experience
            </p> */}
          <Title
            title=" Why Choose RentEase?"
            subtitle="We are committed to providing you with the best rental experience"
          />
        </div>

        <div className="grid grid-cols-2  lg:grid-cols-4 gap-2 lg:gap-6 px-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center  rounded-md border shadow-md cursor-pointer border-gray-50 py-8 lg:py-12 px-1 lg:px-4"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
