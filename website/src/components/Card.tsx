"use client";
import { CardProps } from "@/types";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { EntryList } from ".";

function Card({
    classroom,
    name,
    id,
    entries,
    starred,
    setShouldRerender,
    students,
}: CardProps) {
    let [isShowing, setIsShowing] = useState(false);

    const ref = useRef(null) as any;

    const handleClickOutside = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) setIsShowing(false);
    };
    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    let arr = Object.entries(entries);

    return (
        <div key={id} className="w-[175px] md:w-[250px]">
            <div
                key={id + "sub"}
                className="student-card group w-50 mr-3 my-3"
                onClick={() => setIsShowing(true)}>
                <Image
                    id={"img" + id}
                    src={`/${classroom}/${name
                        .replaceAll(" ", "")
                        .toLowerCase()}.png`}
                    alt={name}
                    width={150}
                    height={150}
                    className="rounded-lg shadow-inner hover:shadow-sm w-[200px] md:w-[150px] mb-2"
                />

                <h2 className="student-card__content-title text-center">
                    {name}
                </h2>
            </div>
            <EntryList
                setShouldRerender={setShouldRerender}
                id={id}
                isShowing={isShowing}
                setIsShowing={setIsShowing}
                entries={arr}
                students={students}></EntryList>
        </div>
    );
}

export default Card;
