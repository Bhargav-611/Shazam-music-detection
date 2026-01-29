import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "Nano Banana | Future of Freshness",
    description: "Premium juice crafted for the extraordinary. Experience pure fruit, pure life.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${outfit.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
