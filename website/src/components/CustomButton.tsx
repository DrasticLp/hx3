"use client";

import React from "react";
import Image from "next/image";
import { CustomButtonProps } from "@/types";

function CustomButton({
    title,
    containerStyles,
    buttonType,
    handleClick,
}: CustomButtonProps) {
    return (
        <button
            disabled={false}
            type={buttonType}
            className={`custom-btn ${containerStyles} `}
            onClick={handleClick}>
            <span className={"flex-1"}>{title}</span>
        </button>
    );
}

export default CustomButton;
