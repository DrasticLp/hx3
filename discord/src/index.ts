import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import * as express from "express";

config();

start();

async function start() {
    const client = new Client({ intents: [GatewayIntentBits.GuildMembers] });
    const app = express.default();
    app.use(express.json());

    await client.login(process.env.TOKEN);

    client.once("ready", async client => {
        const user = await client.users.fetch(process.env.ID);
        console.log("[INFO] Discord Bot Ready");

        app.set("port", parseInt(process.env.PORT) || 69);

        app.post("/addentry", (req, res) => {
            const entry = req.body;

            const embed = new EmbedBuilder()
                .setTitle("Nouvelle entrée")
                .setColor("Green")
                .setURL("https://hx3.org")
                .setFooter({ text: entry.date })
                .setFields([
                    { name: "Contenu", value: entry.content, inline: true },
                    {
                        name: "Visiblilité",
                        value: entry.private ? "Privé" : "Public",
                        inline: true,
                    },
                    {
                        name: "Concernés",
                        value: (entry.concerned as string[])
                            .map((v: string) => `- ${v}`)
                            .join("\n"),
                        inline: true,
                    },
                ]);

            user.send({ embeds: [embed] });
            res.json({ done: true });
        });

        app.post("/editentry", (req, res) => {
            const before = req.body.before;
            const after = req.body.after;

            const embed = new EmbedBuilder()
                .setTitle("Entrée modifiée")
                .setColor("Blue")
                .setURL("https://hx3.org")
                .setFields([
                    { name: "Avant", value: "\n", inline: false },
                    { name: "Contenu", value: before.content, inline: true },
                    {
                        name: "Visiblilité",
                        value: before.private ? "Privé" : "Public",
                        inline: true,
                    },
                    {
                        name: "Concernés",
                        value: (before.concerned as string[])
                            .map((v: string) => `- ${v}`)
                            .join("\n"),
                        inline: true,
                    },
                    { name: "Après", value: "\n", inline: false },
                    { name: "Contenu", value: after.content, inline: true },
                    {
                        name: "Visiblilité",
                        value: after.private ? "Privé" : "Public",
                        inline: true,
                    },
                    {
                        name: "Concernés",
                        value: (after.concerned as string[])
                            .map((v: string) => `- ${v}`)
                            .join("\n"),
                        inline: true,
                    },
                ]);

            user.send({ embeds: [embed] });
            res.json({ done: true });
        });

        app.post("/deleteentry", (req, res) => {
            const entry = req.body;

            const embed = new EmbedBuilder()
                .setTitle("Entrée supprimée")
                .setColor("Red")
                .setURL("https://hx3.org")
                .setFields([
                    { name: "Contenu", value: entry.content, inline: true },
                    {
                        name: "Visiblilité",
                        value: entry.private ? "Privé" : "Public",
                        inline: true,
                    },
                    {
                        name: "Concernés",
                        value: (entry.concerned as string[])
                            .map((v: string) => `- ${v}`)
                            .join("\n"),
                        inline: true,
                    },
                ]);

            user.send({ embeds: [embed] });
            res.json({ done: true });
        });

        app.listen(process.env.PORT, () => {
            console.log("[INFO] Express server ready");
            console.log("[INFO] Port: " + process.env.PORT);
        });
    });
}
