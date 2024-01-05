import React from "react";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
    return (
        <header className="w-full absolute z-10">
            <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:pd-16 px-6 py-4">
                <Link href="/" className="flex justify-center items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo hx3"
                        width={118}
                        height={18}
                        className="object-contain"
                    />
                </Link>
            </nav>
        </header>
    );
}

export default Navbar;
