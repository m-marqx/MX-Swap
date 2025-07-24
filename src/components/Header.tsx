import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        {/* Geometric Cat Face Logo */}
                        <Image
                            src="/icons/logo.svg"
                            alt="Pandora Swap Logo"
                            width={40}
                            height={40}
                            className="w-8 h-8"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[#d87a16] via-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent">
                            Pandora Swap
                        </h1>
                    </div>
                </div>

                <nav className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/pandora/swap"
                        className="text-muted-foreground hover:text-primary-text-color transition-colors"
                    >
                        Swap
                    </Link>
                    <Link
                        href="/pandora/portfolio"
                        className="text-muted-foreground hover:text-primary-text-color transition-colors"
                    >
                        Portfolio
                    </Link>
                    <Link
                        href="/pandora/ai-signals"
                        className="text-muted-foreground hover:text-primary-text-color transition-colors"
                    >
                        AI Signals
                    </Link>
                </nav>

                <Button
                    className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-[var(--glow-primary)] transition-all duration-300"
                    onClick={() => redirect("/pandora/ai-signals")}
                >
                    Launch dApp
                </Button>
            </div>
        </header>
    );
};

export default Header;
