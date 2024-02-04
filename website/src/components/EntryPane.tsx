"use client";
import { EntryPaneProps } from "@/types";
import {
    Button,
    Dialog,
    Label,
    Switch,
    TagInput,
    Textarea,
    toaster,
} from "evergreen-ui";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

function EntryPane({
    id,
    baseContent,
    baseConcerned,
    basePrivate,
    students,
    opened,
    close,
    closeParent,
    setShouldRerender,
}: EntryPaneProps) {
    let [cookies, setCookie] = useCookies(["token", "user"]);
    const [content, setContent] = useState(baseContent);
    const [isPrivate, setIsPrivate] = useState(basePrivate);

    let reverse: any = {};
    let names: string[] = [];

    async function deleteEntry() {
        let res = await (
            await fetch("/api/deleteentry", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    username: cookies.user,
                    token: cookies.token,
                }),
            })
        ).json();

        if (res.res == "ok") {
            toaster.success("Entrée supprimée avec succès !", { duration: 3 });
            setShouldRerender(true);
        } else if (res.res == "perm") {
            toaster.danger("Vous n'avez pas la permission requise !", {
                duration: 3,
            });
        } else if (res.res == "entry") {
            toaster.warning("On dirait que cette entrée n'existe pas", {
                duration: 3,
            });
        }

        close();
        closeParent();
    }

    for (let k of students.keys()) {
        let name = students.get(k)?.name;

        if (!name) continue;

        reverse[name] = k;
        if (!names.includes(name)) names.push(name);
    }

    const [values, setValues] = React.useState(
        baseConcerned.map((v) => students.get(v)?.name as string)
    );

    const autocompleteItems = React.useMemo(
        () => names.filter((i) => !values.includes(i)),
        [names, values]
    );

    let connectedAsPDM =
        (cookies.user.startsWith("PDM") || cookies.user == "ADMIN") &&
        cookies.token != "-1";

    async function submit() {
        if (content == baseContent && baseConcerned == values) return;

        let data = {
            concerned: values.map((v) => {
                return reverse[v];
            }),
            content: content,
            id: id,
            username: cookies.user,
            token: cookies.token,
            private: isPrivate,
        };

        if (data.concerned.length == 0 || data.content.length == 0) {
            toaster.danger("Impossible de rajouter l'entrée", {
                description:
                    "Vous devez au moins avoir une personne concernée et un contenu",
                duration: 3,
            });
            close();
            closeParent();
            return;
        }

        let res = await (
            await fetch("/api/editentry", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
        ).json();

        if (res.res == "ok") {
            toaster.success("Entrée modifiée avec succès", {
                description: "👌",
                duration: 3,
            });
            setShouldRerender(true);
        }
        if (res.res == "perm")
            toaster.danger("Vous n'avez pas la permission requise !", {
                duration: 3,
            });
        else if (res.res == "size")
            toaster.danger("Impossible de modifier l'entrée", {
                description:
                    "Vous devez au moins avoir une personne concernée et un contenu",
                duration: 3,
            });

        setValues([]);
        setContent("");
        close();
        closeParent();
    }

    return (
        <Dialog
            key={id}
            isShown={opened}
            title="Ajouter une entrée"
            shouldCloseOnEscapePress={false}
            onCloseComplete={close}
            footer={() => {
                return (
                    <div>
                        {connectedAsPDM ? (
                            <Button
                                intent="danger"
                                className="mr-3"
                                onClick={deleteEntry}>
                                Supprimer
                            </Button>
                        ) : (
                            ""
                        )}
                        {connectedAsPDM ? (
                            <Button
                                intent="success"
                                className="mr-3"
                                onClick={() => {
                                    if (connectedAsPDM) submit();
                                    else close();
                                }}>
                                {connectedAsPDM ? "Confirmer" : "Fermer"}
                            </Button>
                        ) : (
                            ""
                        )}
                    </div>
                );
            }}>
            <Label htmlFor="textareaentry" marginBottom={4} display="block">
                Contenu
            </Label>
            <Textarea
                disabled={!connectedAsPDM}
                id="textareaentry"
                placeholder="Dis-moi tout..."
                defaultValue={baseContent}
                height={200}
                onChange={(e: any) => setContent(e.target.value)}
                onSubmit={() => {}}></Textarea>

            <Label htmlFor="inputtags" marginBottom={4} display="block">
                Concernés
            </Label>
            <TagInput
                disabled={!connectedAsPDM}
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
                disabled={!connectedAsPDM}
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}></Switch>
        </Dialog>
    );
}

export default EntryPane;
