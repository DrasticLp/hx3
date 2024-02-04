"use client";
import { PzUploaderProps } from "@/types";
import {
    FileRejection,
    MimeType,
    Pane,
    rebaseFiles,
    FileUploader,
    FileRejectionReason,
    Alert,
    majorScale,
    FileCard,
    Dialog,
    TextInput,
    SelectField,
    toaster,
} from "evergreen-ui";
import React, { ChangeEvent, Fragment, useCallback, useState } from "react";
import isValidFilename from "valid-filename";

function PzUploader({
    show,
    cookies,
    setShown,
    yearList,
    setShouldRerender,
}: PzUploaderProps) {
    const maxFiles = 50;
    const maxSizeInBytes = 100 * 1024 ** 2;
    const acceptedMimeTypes = [MimeType.jpeg, MimeType.png];

    const [files, setFiles] = useState([] as File[]);
    const [fileRejections, setFileRejections] = useState([] as FileRejection[]);
    const [year, setYear] = useState("230");
    const [event, setEvent] = useState("");
    const values = React.useMemo(
        () => [...files, ...fileRejections.map((r) => r.file)],
        [files, fileRejections]
    );

    const handleRemove = useCallback(
        (file: File) => {
            const updatedFiles = files.filter((f) => f != file);
            const updatedFileRejections = fileRejections.filter(
                (f) => f.file != file
            );

            const { accepted, rejected } = rebaseFiles(
                [...updatedFiles, ...updatedFileRejections.map((f) => f.file)],
                { acceptedMimeTypes, maxFiles, maxSizeInBytes }
            );

            setFiles(accepted);
            setFileRejections(rejected);
        },
        [acceptedMimeTypes, files, fileRejections, maxFiles, maxSizeInBytes]
    );

    const fileCountOverLimit = files.length + fileRejections.length - maxFiles;
    const fileCountError = `Vous pouvez envoyer un maximum de ${maxFiles} fichier. Veuillez enlever ${fileCountOverLimit} fichier(s).`;

    async function handleFileUpload() {
        if (files.length == 0) {
            toaster.warning("Veuillez sélectionner des fichiers !", {
                duration: 3,
            });
            return;
        }

        if (!isValidFilename(event) || event == "" || event == " ") {
            toaster.danger("Ce nom n'est pas valide !", {
                duration: 3,
            });
            return;
        }

        if (!cookies.user.startsWith("PZ") && cookies.user != "ADMIN") {
            toaster.danger("Vous n'avez pas les permissions nécessaires", {
                duration: 3,
            });
            return;
        }

        const formData = new FormData();

        for (let f of files) {
            formData.append("files", f);
        }

        formData.set("year", year);
        formData.set("event", event);
        formData.set("token", cookies.token);
        formData.set("username", cookies.user);

        const res = await (
            await fetch("/api/pzupload", {
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

        if (res.res == "invalidfile") {
            toaster.danger("Ce nom n'est pas valide !", {
                duration: 3,
            });
            return;
        }

        if (res.res == "nofiles") {
            toaster.danger("Veuillez sélectionner des fichiers", {
                duration: 3,
            });
            return;
        }

        if (res.res == "unknownerror") {
            toaster.danger("Une erreur inconnue s'est produite", {
                duration: 3,
            });
            return;
        }

        if (res.res == "ok")
            toaster.success("Fichiers envoyés avec succès !", { duration: 3 });
        setShouldRerender(true);
    }

    return (
        <Pane maxWidth={654}>
            <Dialog
                isShown={show}
                title="Envoyer des images"
                confirmLabel="Envoyer"
                cancelLabel="Annuler"
                onCancel={() => {
                    setFiles([]);
                    setFileRejections([]);
                    setShown(false);
                }}
                onConfirm={() => {
                    handleFileUpload().then(() => {
                        setFiles([]);
                        setFileRejections([]);
                        setShown(false);
                    });
                }}>
                <SelectField
                    key="year"
                    label="Année"
                    width={240}
                    onChange={(selected) => {
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
                <TextInput
                    name="eventname"
                    placeholder="Nom de l'événement"
                    onChange={(e: any) => setEvent(e.target.value)}
                />
                <FileUploader
                    acceptedMimeTypes={acceptedMimeTypes}
                    label="Envoyer des Images"
                    description={`Maximum ${maxFiles} fichiers`}
                    disabled={files.length + fileRejections.length >= maxFiles}
                    maxSizeInBytes={maxSizeInBytes}
                    maxFiles={maxFiles}
                    onAccepted={setFiles}
                    onRejected={setFileRejections}
                    renderFile={(f, i) => {
                        const { name, size, type } = f;

                        const renderFileCountError =
                            i == 0 && fileCountOverLimit > 0;

                        const rej = fileRejections.find(
                            (r) =>
                                r.file == f &&
                                r.reason != FileRejectionReason.OverFileLimit
                        );

                        const { message } = rej || {};

                        return (
                            <Fragment key={`${f.name}-${i}`}>
                                {renderFileCountError && (
                                    <Alert
                                        intent="danger"
                                        marginBottom={majorScale(2)}
                                        title={fileCountError}
                                    />
                                )}

                                <FileCard
                                    isInvalid={rej != null}
                                    name={name}
                                    onRemove={() => handleRemove(f)}
                                    sizeInBytes={size}
                                    type={type}
                                    validationMessage={message}></FileCard>
                            </Fragment>
                        );
                    }}
                    values={values}
                />
            </Dialog>
        </Pane>
    );
}

export default PzUploader;
