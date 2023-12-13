import type { Metadata } from "next";
import "./globals.css";
import { Session } from "./components/session";
import Status from "./components/status";
import Image from "next/image";

export const metadata: Metadata = {
  title: "File Storage",
  description:
    "Application that aims to store files using cloud computing technologies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-background">
        <Session>
          <header className="flex flex-row justify-between items-center px-6 py-3 border-b shadow-sm">
            <div className="flex flex-row items-center gap-4">
              <Image src={"/favicon.ico"} width={50} height={50} alt="Logo" />

              <span className="dark:text-white">File Storage</span>
            </div>

            <Status />
          </header>

          {children}

          <footer className="dark:text-white text-center border-t py-3">
            &copy; {new Date().getFullYear()} Designed by @aydinkasimoglu
          </footer>
        </Session>
      </body>
    </html>
  );
}
