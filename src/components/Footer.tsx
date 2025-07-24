import React from "react";

export const Footer = () => {
    return (
        <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm">
                        © 2025 Pandora Swap. All rights reserved.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Built with ❤️ by Archie Marques
                    </p>
                </div>
        </footer>
    );
};

export default Footer;
