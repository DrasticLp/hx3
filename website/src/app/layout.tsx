import type { Metadata } from "next";
import "./globals.css";
import { Footer, Navbar } from "@/components";

export const metadata: Metadata = {
    title: "HX3",
    description: "La meilleur classe de prépa de Faidherbe",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className="relative">
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
