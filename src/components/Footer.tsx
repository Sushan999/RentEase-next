import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 pt-12">
      <div className="container mx-auto px-4 md:flex md:justify-between md:items-center">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-white">RentEase</h2>
          <p className="text-sm text-gray-400">
            Your trusted platform for hassle-free rentals.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <ul>
            <li className="mb-2">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
          <ul>
            <li className="mb-2">
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
        © 2025 RentEase. All rights reserved.
      </div>
    </footer>
  );
}
