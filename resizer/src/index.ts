import { createCanvas, loadImage } from "canvas";
import { existsSync } from "fs";
import { mkdir, readdir, writeFile } from "fs/promises";

start();

async function start() {
    console.log("Starting");
    if (!existsSync("./resized")) await mkdir("./resized");

    const arr = await readdir("./images");

    let i = 0;
    for (let file of await readdir("./images")) {
        await resize(file);
        i++;
        console.log(i + "/" + arr.length);
    }

    console.log("Done");
}

async function resize(path: string) {
    console.log("Processing " + path);
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext("2d");
    let img = await loadImage("./images/" + path);
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 512, 512);

    await writeFile("./resized/" + path, canvas.toBuffer());
}
