import "@/app/globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/toaster";
import UserInfo from "@/components/user-info";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head><title>Taller de Blockchain y Gaming</title></head>
            <body className={cn("bg-background font-sans antialiased", fontSans.variable)}>
                <main className="min-h-screen">{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
