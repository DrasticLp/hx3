"use client";
import { PzSectionProps } from "@/types";
import {
    Button,
    Combobox,
    Option,
    Pane,
    Select,
    SelectField,
    Tab,
    Tablist,
} from "evergreen-ui";
import React, { use, useState } from "react";
import Image from "next/image";
import { CustomButton, ImageSlider, PzUploader } from ".";
import { useCookies } from "react-cookie";

function PzSection({ files, setShouldRerender }: PzSectionProps) {
    const [year, setYear] = useState("230");
    const [event, setEvent] = useState("");
    let [cookies, setCookie] = useCookies(["token", "user"]);
    const [filePickerOpened, setFilePickerOpened] = useState(false);

    const yearList = Object.keys(files);

    return (
        <div
            key="pz"
            className="mb-56 flex items-center justify-center flex-col w-full">
            <SelectField
                key="year"
                label="Année"
                width={240}
                onChange={(selected) => {
                    setEvent("");
                    setYear(selected.target.value);
                }}
                defaultValue={Object.keys(files)[0]}>
                {yearList.map((v) => {
                    return (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    );
                })}
            </SelectField>
            {cookies.user.startsWith("PZ") || cookies.user == "ADMIN" ? (
                <CustomButton
                    title="Ajouter"
                    containerStyles="bg-primary-color text-white rounded-full mr-5"
                    handleClick={() => setFilePickerOpened(true)}
                />
            ) : (
                ""
            )}
            <div className="flex flex-row">
                {Object.keys(files[year])
                    .filter((v) => v != "hasSubDirs")
                    .map((event) => {
                        return (
                            <CustomButton
                                key={event}
                                title={event}
                                containerStyles="bg-primary-color text-white rounded-full mt-10 mr-5"
                                handleClick={() => setEvent(event)}
                            />
                        );
                    })}
            </div>
            <ImageSlider
                files={files}
                event={event}
                year={year}
                setShouldRerender={setShouldRerender}
                cookies={cookies}
                setEvent={setEvent}></ImageSlider>
            <PzUploader
                setShouldRerender={setShouldRerender}
                cookies={cookies}
                show={filePickerOpened}
                yearList={yearList}
                setShown={setFilePickerOpened}></PzUploader>
        </div>
    );
}

export default PzSection;
