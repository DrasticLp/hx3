"use client";
import { AddEntryProps } from "@/types";
import React, { useState } from "react";
import {
    Button,
    Label,
    Textarea,
    Dialog, 
    TagInput,
    toaster,
    Switch,
} from "evergreen-ui";

function AddEntry({
    opened,
    setOpened,
    students,
    setShouldRerender,
}: AddEntryProps) {
    const [content, setContent] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    const [values, setValues] = React.useState([""]);

    let reverse: any = {};
    let names: string[] = [];

    for (let k of students.keys()) {
        let name = students.get(k)?.name;

        if (!name) continue;

        reverse[name] = k;
        if (!names.includes(name)) names.push(name);
    }

    const submit = async () => {
        let data = {
            concerned: values.map(v => {
                return reverse[v];
            }),
            content: content,
            private: isPrivate,
        };

        if (data.concerned.length == 0 || data.content.length == 0) {
            setOpened(false);
            toaster.danger("Impossible de rajouter l'entrée", {
                description:
                    "Vous devez au moins avoir une personne concernée et un contenu",
                duration: 3,
            });
            return;
        }

        let res = await (
            await fetch("/api/addentry", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
        ).json();

        if (res.ok) {
            toaster.success("Entrée rajoutée avec succès", {
                description: "👌",
                duration: 3,
            });
        } else
            toaster.danger("Impossible de rajouter l'entrée", {
                description:
                    "Vous devez au moins avoir une personne concernée et un contenu",
                duration: 3,
            });

        setOpened(false);
        setValues([]);
        setContent("");
        setIsPrivate(false);
        setShouldRerender(true);
    };

    const autocompleteItems = React.useMemo(
        () => names.filter(i => !values.includes(i)),
        [names, values]
    );

    return (
        <div>
            <Dialog
                isShown={opened}
                title="Ajouter une entrée"
                shouldCloseOnEscapePress={false}
                onCloseComplete={() => setOpened(false)}
                footer={() => {
                    return (
                        <div>
                            <Button
                                intent="danger"
                                className="mr-3"
                                onClick={() => setOpened(false)}>
                                Annuler
                            </Button>
                            <Button intent="success" onClick={submit}>
                                Confirmer
                            </Button>
                        </div>
                    );
                }}>
                <Label htmlFor="textareaentry" marginBottom={4} display="block">
                    Contenu
                </Label>
                <Textarea
                    id="textareaentry"
                    placeholder="Dis-moi tout..."
                    onChange={(e: any) => setContent(e.target.value)}
                    onSubmit={() => {}}></Textarea>

                <Label htmlFor="inputtags" marginBottom={4} display="block">
                    Concernés
                </Label>
                <TagInput
                    id="inputtags"
                    inputProps={{ placeholder: "Concernés" }}
                    values={values}
                    onChange={setValues}
                    autocompleteItems={autocompleteItems}
                />
                <Label htmlFor="textareaentry" marginBottom={4} display="block">
                    Privé (seul les PDM pourront le voir)
                </Label>
                <Switch
                    checked={isPrivate}
                    onChange={e => setIsPrivate(e.target.checked)}></Switch>
            </Dialog>
        </div>
    );
}

export default AddEntry;
