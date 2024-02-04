"use client";
import { ImageSliderProps } from "@/types";
import React, { Fragment, useState } from "react";
import { BrowserView, MobileOnlyView } from "react-device-detect";
import {
    Button,
    Dialog,
    IconButton,
    Pane,
    Spinner,
    TrashIcon,
    toaster,
} from "evergreen-ui";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { useCookies } from "react-cookie";

function ImageSlider({
    files,
    event,
    year,
    setEvent,
    setShouldRerender,
    cookies,
}: ImageSliderProps) {
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    let images: any = files[year][event]
        ? Object.values(files[year][event])
        : [{ url: "/hero.png", width: 2183, height: 1792 }];

    preloadImages(images, setIsLoading);

    if (isLoading)
        return (
            <Pane key="slider">
                <Dialog
                    isShown={event != ""}
                    title={event}
                    onCloseComplete={() => setEvent("")}>
                    <Spinner></Spinner>
                </Dialog>
            </Pane>
        );

    return (
        <Pane key="slider">
            <BrowserView>
                {getDiv(false, index, setIndex, images, {
                    files,
                    event,
                    year,
                    cookies,
                    setShouldRerender,

                    setEvent,
                })}
            </BrowserView>
            <MobileOnlyView>
                {getDiv(true, index, setIndex, images, {
                    files,
                    event,
                    year,
                    cookies,
                    setShouldRerender,
                    setEvent,
                })}
            </MobileOnlyView>
        </Pane>
    );
}

async function preloadImages(
    images: any[],
    setIsLoading: (isLoading: boolean) => void
) {
    const promises = await images.map(
        (i) =>
            new Promise((res, rej) => {
                const img = new Image();

                img.src = i.url;
                img.onload = res;
                img.onerror = rej;
            })
    );

    await Promise.all(promises);

    setIsLoading(false);
}

function getDiv(
    isMd: boolean,
    index: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>,
    images: any[],

    {
        files,
        event,
        year,
        setEvent,
        setShouldRerender,
        cookies,
    }: ImageSliderProps
) {
    const f = isMd ? 0.9 : 0.4;
    const ratio = images[index].height / images[index].width;

    let width = window.innerWidth * f * 0.85;
    let height = ratio * width;
    let maxHeight = isMd ? 385 : 526;

    if (height > maxHeight) {
        height = maxHeight;
        width = height / ratio;
    }

    function next() {
        index++;
        setIndex(index == images.length ? 0 : index);
    }

    function previous() {
        index--;
        setIndex(index == -1 ? images.length - 1 : index);
    }

    async function handleDelete() {
        if (!cookies.user.startsWith("PZ") && cookies.user != "ADMIN") {
            toaster.danger("Vous n'avez pas les permissions nécessaires", {
                duration: 3,
            });
            return;
        }

        const formData = new FormData();
        formData.set("year", year);
        formData.set("event", event);
        formData.set("token", cookies.token);
        formData.set("username", cookies.user);

        const res = await (
            await fetch("/api/deletepz", {
                method: "POST",
                body: formData,
            })
        ).json();

        if (res.res == "perm") {
            toaster.danger("Vous n'avez pas les permissions nécessaires", {
                duration: 3,
            });
            return;
        }

        if (res.res == "ok")
            toaster.success("Fichiers supprimés avec succès !", {
                duration: 3,
            });
        setIndex(0);
        setEvent("");
        setShouldRerender(true);
    }

    return (
        <Dialog
            isShown={event != ""}
            title={event}
            width={window.innerWidth * f}
            hasFooter={false}
            onCloseComplete={() => {
                setIndex(0);
                setEvent("");
            }}>
            <div className="w-full flex items-center justify-center flex-col">
                <div
                    style={{
                        backgroundImage: `url(${images[index].url})`,
                        height: `${height}px`,
                        width: `${width}px`,
                    }}
                    className="rounded-2xl bg-center bg-cover duration-500">
                    <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                        <BsChevronCompactLeft
                            size={30}
                            onClick={previous}></BsChevronCompactLeft>
                    </div>
                    <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                        <BsChevronCompactRight
                            onClick={next}
                            size={30}></BsChevronCompactRight>
                    </div>
                </div>
                <br />
                <div>
                    {(() => {
                        if (
                            cookies.user.startsWith("PZ") ||
                            cookies.user == "ADMIN"
                        )
                            return (
                                <IconButton
                                    icon={TrashIcon}
                                    intent="danger"
                                    className="mr-3"
                                    onClick={handleDelete}
                                />
                            );
                        return <></>;
                    })()}
                    <Button
                        intent="success"
                        appearance="primary"
                        onClick={() =>
                            window.open(
                                "/api/downloadpz?year=" +
                                    year +
                                    "&event=" +
                                    event
                            )
                        }>
                        Télécharger
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

export default ImageSlider;
