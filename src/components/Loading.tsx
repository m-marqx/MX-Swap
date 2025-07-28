import Image from "next/image";
import React from "react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center w-full">
            <div className="relative h-32 w-32 flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-background border-6 border-t-6 border-t-primary border-b-6 border-b-primary"></div>
                <Image
                    src="/icons/logo.svg"
                    alt="Pandora Swap Logo"
                    width={512}
                    height={512}
                    className="absolute w-18 h-18"
                />
            </div>
        </div>
    );
}
