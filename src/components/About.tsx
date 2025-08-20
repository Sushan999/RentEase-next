import Title from "./Title";
import Image from "next/image";

export default function About() {
  return (
    <div className=" bg-gray-50" id="about">
      <div className="flex flex-col items-center justify-center container mx-auto p-10 md:px-20 lg:px-32 w-full overflow-hidden">
        <Title
          title="Our Brand"
          subtitle=" Passionate About Properties, Dedicated to your Vision"
        />
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
            <div className="grid grid-cols-2 gap-6 md:gap-10 w-full 2xl:pr-28">
              <div>
                <p className="text-3xl md:text-4xl font-medium text-gray-800">
                  10+
                </p>
                <p className="text-sm">Years of Excellence</p>
              </div>
              <div>
                <p className="text-3xl font-medium text-gray-800">12+</p>
                <p className="text-sm">Projects Completed</p>
              </div>
              <div>
                <p className="text-3xl font-medium text-gray-800">20+</p>
                <p className="text-sm">Mn. Sq. Ft. Delivered</p>
              </div>
              <div className="text-sm">
                <p className="text-3xl font-medium text-gray-800">25+</p>
                <p>Ongoing Projects</p>
              </div>
            </div>
            <p className="text-sm md:text-base my-10 max-w-lg text-justify">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industrys standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book
            </p>
            <button className="bg-blue-600 text-white px-8 py-2 rounded">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
