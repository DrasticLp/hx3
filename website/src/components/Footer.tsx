import React from "react";
import Link from "next/link";
import Image from "next/image";
import { footerLinks } from "@/constants";

function Footer() {
    return (
        <footer className="flex flex-col text-black-100 mt-5 border-t border-gray-100">
            <div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
                <div className="flex flex-col justify-start items-start gap-6">
                    <Image
                        src="/logo.png"
                        alt="HX3 Logo"
                        width={118}
                        height={18}
                        className="object-contain"
                    />

                    <p className="text-base text-gray-700">
                        HX3 2023 <br />
                        &copy; By Tarik Mesbahi le Roi
                    </p>
                </div>

                <div className="footer__links">
                    {footerLinks.map(link => (
                        <div className="footer__link" key={link.title}>
                            <h3 className="font-bold">{link.title}</h3>
                            {link.links.map(item => (
                                <Link
                                    className="text-gray-500"
                                    key={item.title}
                                    href={item.url}>
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-center flex-wrap border-t border-gray-100 sm:px-16 px-6 py-10 mt-10">
                <p>@HX3 230 Meilleure année</p>
                <Link href="/" className="text-gray-500">
                    Rush Baggio
                </Link>
            </div>
        </footer>
    );
}

export default Footer;
