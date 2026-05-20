import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";

import NextAuthSessionProvider from "@/providers/sessionProvider";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
const roboto = Roboto({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Werk OS App",
  description: "Sistema de gerenciamento de OS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={roboto.className}>
        <NextAuthSessionProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <ToastContainer />
            </ThemeProvider>
          </AuthProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
