import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientLayout from "./ClientLayout";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "RentEase - Rent and List Your apartments",
  description: "Home Rental Website to rent Homes, Apartment and Villas",
  icons: {
    icon: "home.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <Navbar />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            style={{ marginTop: "4rem" }}
          />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
