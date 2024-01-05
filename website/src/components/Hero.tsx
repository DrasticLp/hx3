"use client";

import React from "react";
import Image from "next/image";
import { CustomButton } from ".";

function Hero() {
    const handleScroll = () => {};

    return (
        <div className="hero">
            <div className="flex-1 pt-36 padding-x">
                <h1 className="hero__title">
                    La classe clairement meilleure que la HX4
                </h1>

                <p className="hero__subtitle">
                    Ce que faidherbe enseigne, ailleurs ne s'apprend pas
                </p>

                <div className="flex flex-row ">
                    <CustomButton
                        title="Maths"
                        containerStyles="bg-primary-color text-white rounded-full mt-10"
                        handleClick={() =>
                            window.open(
                                "https://faidherbe.org/~pcsimath/pcsi1/HX3/HX3.html"
                            )
                        }
                    />

                    <CustomButton
                        title="Physique"
                        containerStyles="bg-primary-color text-white rounded-full mt-10 mx-5"
                        handleClick={() =>
                            window.open("https://benlhajlahsen.fr/")
                        }
                    />

                    <CustomButton
                        title="PDM"
                        containerStyles="bg-primary-color text-white rounded-full mt-10"
                        handleClick={handleScroll}
                    />
                </div>
            </div>

            <div className="hero__image-container">
                <div className="hero__image translate-x-[160px]">
                    <Image
                        src="/hero.png"
                        alt="hero"
                        fill
                        className="object-contain "
                    />
                </div>
                {bg_svg()}
            </div>
        </div>
    );
}

const bg_svg = () => (
    <svg
        id="sw-js-blob-svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        className="absolute xl:-top-24 xl:-right-1/2 -right-1/4  bg-repeat-round -z-10 w-full xl:h-screen h-[590px] overflow-hidden">
        <defs>
            <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                <stop
                    id="stop1"
                    stopColor="var(--color-secondary)"
                    offset="0%"></stop>
                <stop
                    id="stop2"
                    stopColor="var(--color-primary)"
                    offset="100%"></stop>
            </linearGradient>
        </defs>
        <path
            fill="url(#sw-gradient)"
            d="M25,-38.7C32.2,-34.2,37.9,-27.1,41.2,-19C44.6,-11,45.7,-2.1,44.6,6.5C43.5,15.1,40.2,23.6,34.4,29.2C28.6,34.7,20.2,37.5,11.9,39.5C3.6,41.5,-4.7,42.8,-12.8,41.4C-20.9,40,-28.8,35.9,-32.1,29.3C-35.5,22.8,-34.2,13.8,-35.5,5.1C-36.8,-3.6,-40.6,-11.9,-39.1,-18.9C-37.5,-25.8,-30.5,-31.2,-23.1,-35.7C-15.7,-40.1,-7.9,-43.4,0.5,-44.2C8.9,-45,17.7,-43.2,25,-38.7Z"
            width="100%"
            height="100%"
            transform="translate(50 50)"
            strokeWidth="0"
            style={{
                transition: "all 0.3s ease 0s",
            }}></path>
    </svg>
);

export default Hero;
