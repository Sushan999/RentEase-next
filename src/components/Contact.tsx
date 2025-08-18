import Title from "./Title";

export default function Contact() {
  return (
    <div
      className="text-center p-4 py-12 lg:px-20 w-full overflow-hidden bg-gray-50"
      id="contact"
    >
      <Title
        title="Contact With Us"
        subtitle="Ready to Make a Move? Let’s Build Your Future Together"
      />
      <form className="max-w-2xl mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 text-left">
            Your Name
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              placeholder="Your Name"
              name="Name"
            ></input>
          </div>
          <div className="w-full md:w-1/2 text-left md:pl-4">
            Your Email:
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="email"
              placeholder="Your Email"
              name="Email"
            ></input>
          </div>
        </div>
        <div className="my-6 text-left">
          Message:
          <textarea
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-48 resize-none"
            name="message"
            placeholder="Message"
            required
          ></textarea>
        </div>
        <button className="bg-blue-600 text-white py-2 px-12 mb-10 rounded">
          Send Message
        </button>
      </form>
    </div>
  );
}
