"use client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
    Button,
    Dialog,
    Label,
    Menu,
    Popover,
    TextInput,
    TextInputField,
    toaster,
} from "evergreen-ui";
import React, { Fragment, useState } from "react";
import { CustomButton } from ".";
import { Position } from "evergreen-ui/types";
import { useCookies } from "react-cookie";
import { LoginPageProps } from "@/types";

function LoginPage({ setShouldRerender }: LoginPageProps) {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    const [formOpened, setFormOpened] = useState(false);

    const [cookies, setCookie] = useCookies(["user", "token"]);

    const connect = async () => {
        let token = await (
            await fetch(`/api/login?username=${username}&password=${password}`)
        ).json();
        setFormOpened(false);
        if (token.token != "-1") {
            toaster.success("Connecté !", {
                description: "Compte: " + username,
                duration: 3,
            });
            setCookie("token", token.token, { path: "/" });
            setCookie("user", username, { path: "/" });
            setShouldRerender(true);
        } else {
            toaster.danger("Impossible de se connecter !", {
                description: "Veuillez réessayer",
                duration: 3,
            });
        }
    };

    let isConnected = !["-1", "None", "", null, undefined].includes(
        cookies.token?.toString()
    );

    return (
        <div className="relative flex justify-end z-20">
            <div className="flex flex-row relative justify-center items-center py-3 px-6 ">
                <button
                    disabled={false}
                    type="button"
                    className={`custom-btn rounded-full bg-white text-primary-color`}
                    onClick={() => {
                        if (!isConnected) setFormOpened(true);
                        else {
                            setCookie("user", "");
                            setCookie("token", "-1");
                            setShouldRerender(true);
                        }
                    }}>
                    <span className={"flex-1"}>
                        {isConnected ? "Déconnexion" : "Connexion"}
                    </span>
                </button>
            </div>

            <Dialog
                isShown={formOpened}
                title="Se connecter"
                onCloseComplete={() => setFormOpened(false)}
                shouldCloseOnEscapePress={false}
                footer={() => {
                    return (
                        <div>
                            <Button
                                intent="danger"
                                className="mr-3"
                                onClick={() => setFormOpened(false)}>
                                Annuler
                            </Button>
                            <Button intent="success" onClick={connect}>
                                Confirmer
                            </Button>
                        </div>
                    );
                }}>
                <TextInputField
                    key="inputusername"
                    label="Nom d'utilisateur"
                    description="(fonction)"
                    onChange={(e: any) => setUsername(e.target.value)}
                />
                <TextInputField
                    key="inputtags"
                    label="Mot de passe"
                    description="🤫"
                    onChange={(e: any) => setPassword(e.target.value)}
                />
            </Dialog>
        </div>
    );
}

export default LoginPage;
