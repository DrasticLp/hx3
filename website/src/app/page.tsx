"use client";
import { Hero, LoginPage, PdmSection, PzSection } from "@/components";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Home() {
    const [data, setData] = useState({});
    const [cookies, setCookie] = useCookies(["user", "token"]);
    const [shouldRerender, setShouldRerender] = useState(true);

    useEffect(() => {
        if (!shouldRerender) return;

        const fetchData = async () => {
            const d = {
                token: cookies.token || "-1",
                username: cookies.user || "",
            };

            const classrooms = await (await fetch("/api/classrooms")).json();
            const entries = await (
                await fetch(
                    "/api/entries?token=" + d.token + "&username=" + d.username
                )
            ).json();

            const files = await (await fetch("/api/filelist")).json();

            setData({ classrooms: classrooms, entries: entries, files: files });
        };

        if (!cookies.token) setCookie("token", "-1");
        if (!cookies.user) setCookie("user", "");
        fetchData();
        setShouldRerender(false);
    }, [cookies, setCookie, setData, shouldRerender, setShouldRerender]);

    if (Object.keys(data).length != 3) return <div></div>;

    return (
        <main className="overflow-hidden">
            <LoginPage setShouldRerender={setShouldRerender} />

            <Hero />
            <div className="mt-12 padding-x padding-y max-width" id="pdm">
                <div id="pdmsection" className="home__text-container">
                    <h1 className="text-4xl font-extrabold">Archives PDM</h1>

                    <p>Découvre ce qui se passe dans la classe</p>
                </div>

                <div className="home__filters">
                    <PdmSection
                        data={(data as any).classrooms}
                        entries={(data as any).entries}
                        setShouldRerender={setShouldRerender}
                    />
                </div>

                <div id="pzsection" className="home__text-container">
                    <h1 className="text-4xl font-extrabold">Archives PZ</h1>

                    <p>Revis les moments forts de la HX3</p>
                </div>

                <div className="home__filters">
                    <PzSection
                        setShouldRerender={setShouldRerender}
                        files={(data as any).files}></PzSection>
                </div>
            </div>
        </main>
    );
}
