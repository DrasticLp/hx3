"use client";

import { EntryListProps } from "@/types";
import {
    Button,
    Dialog,
    Heading,
    Pane,
    Paragraph,
    SideSheet,
    Table,
} from "evergreen-ui";
import React, { useState } from "react";
import EntryPane from "./EntryPane";
import Image from "next/image";
import { MobileOnlyView } from "react-device-detect";

function EntryList({
    id,
    isShowing,
    setIsShowing,
    entries,
    students,
    setShouldRerender,
}: EntryListProps) {
    const [openedPaneId, setOpenedPaneId] = useState("");
    const [showInfos, setShowInfos] = useState(false);
    const student = students.get(id);
    const name = students.get(id)?.name;
    return (
        <Pane key={id + "pane"}>
            <Dialog
                isShown={isShowing}
                title={name}
                onCloseComplete={() => setIsShowing(false)}
                hasFooter={false}
                shouldCloseOnEscapePress={false}>
                <Table.Body>
                    <Table.Head>
                        <Table.TextCell
                            flexBasis="45%"
                            flexShrink={0}
                            flexGrow={0}>
                            Contenu
                        </Table.TextCell>
                        <Table.TextCell>Date</Table.TextCell>
                        <Table.TextCell>Avec</Table.TextCell>
                    </Table.Head>
                    <Table.Body key={id + "tablebody"}>
                        {entries.map((v) => {
                            let i = v[0];
                            let e: any = v[1];
                            return (
                                <Table.Row
                                    key={i}
                                    isSelectable
                                    onSelect={() => {
                                        setOpenedPaneId(i);
                                    }}>
                                    <EntryPane
                                        id={i}
                                        basePrivate={e.private}
                                        baseConcerned={e.concerned}
                                        baseContent={e.content}
                                        opened={openedPaneId == i}
                                        close={() => setOpenedPaneId("")}
                                        students={students}
                                        setShouldRerender={setShouldRerender}
                                        closeParent={() => setIsShowing(false)}
                                    />
                                    <Table.TextCell
                                        flexBasis="45%"
                                        flexShrink={0}
                                        flexGrow={0}>
                                        {e.content}
                                    </Table.TextCell>
                                    <Table.TextCell>{e.date}</Table.TextCell>
                                    <Table.TextCell>
                                        {Object.entries(e.concerned)
                                            .filter((k) => k[1] != id)
                                            .map((n) =>
                                                students.has(n[1] as string) ? (
                                                    <div
                                                        key={
                                                            (n[1] as string) ||
                                                            ""
                                                        }>
                                                        {"- " +
                                                            students.get(
                                                                n[1] as string
                                                            )?.name}
                                                        <br />
                                                    </div>
                                                ) : (
                                                    <div key={n[0]}></div>
                                                )
                                            )}
                                    </Table.TextCell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table.Body>
                <React.Fragment>
                    <SideSheet
                        isShown={showInfos}
                        onCloseComplete={() => setShowInfos(false)}
                        containerProps={{
                            display: "flex",
                            flex: "1",
                            flexDirection: "column",
                        }}>
                        <Pane
                            zIndex={1}
                            flexShrink={0}
                            elevation={0}
                            backgroundColor="white">
                            <Pane padding={16} className="">
                                <div className="inline-flex">
                                    <Image
                                        src={`/${
                                            student?.classroom
                                        }/${student?.name
                                            .replaceAll(" ", "")
                                            .toLowerCase()}.png`}
                                        alt="PP"
                                        width={50}
                                        height={50}
                                        className="mb-5 rounded-full"></Image>
                                    <Heading
                                        size={600}
                                        className="ml-4 translate-y-3">
                                        {name}
                                    </Heading>
                                </div>
                                <MobileOnlyView>
                                    <Button onClick={() => setShowInfos(false)}>
                                        <LogoutButton />
                                    </Button>
                                </MobileOnlyView>
                            </Pane>
                        </Pane>

                        <Paragraph marginLeft={40}>
                            {`Année: ${
                                2023 +
                                230 -
                                parseInt(
                                    (() => {
                                        let s = student?.classroom.split("-");
                                        return s
                                            ? s[s?.length - 1] || "230"
                                            : "230";
                                    })()
                                )
                            }`}
                            <br />
                            {`Fonctions:`}
                            <br />
                            {student?.functions.length != 0
                                ? student?.functions.map((f) => (
                                      <div key={f}>
                                          {`- ${f}`}
                                          <br />
                                      </div>
                                  ))
                                : "- Aucune"}
                            <br />
                            {"Description:"}
                            <br />
                            {student?.description}
                        </Paragraph>
                    </SideSheet>
                </React.Fragment>
                <div className="flex justify-end mt-5" key={"btn_close" + id}>
                    <Button
                        key={"infos"}
                        className="mr-2"
                        onClick={() => setShowInfos(true)}>
                        Infos
                    </Button>
                    <Button
                        key={"close"}
                        onClick={() => setIsShowing(false)}
                        intent="danger">
                        Fermer
                    </Button>
                </div>
            </Dialog>
        </Pane>
    );
}
function LogoutButton(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="16"
            viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
        </svg>
    );
}

export default EntryList;
