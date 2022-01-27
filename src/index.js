import "./style.css";
import { set_canvas_dimentions, fit_image } from "./fitness";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const fileInput = document.getElementById("file-input");
const processButt = document.querySelector(".process");
const downloadButt = document.querySelector(".download-images");
const gallery = document.querySelector(".gallery");
const loadingScreen = document.querySelector(".loading-screen");
let id, imageDivs;

function name_image() {
    let name;

    name = "image_";
    for (let i = 0; i < 6; i++)
        name += Math.floor(Math.random() * 10);
    return name;
}

function init() {
    id = 0;
    imageDivs = [];

    downloadButt.classList.add("hidden");
    gallery.innerHTML = '';
    fileInput.parentElement.classList.remove("hidden");
    processButt.classList.add("hidden");
}

function create_columns(nImages) {
    let columns;

    columns = nImages > 3 ? 4 : nImages;
    gallery.innerHTML = '';
    for (let i = 0; i < columns; i++) {
        const column = document.createElement("div");
        column.classList.add("column");
        column.style.flex = `${100 / columns}`;
        column.style.maxWidth = `${100 / columns}`;
        column.dataset.number = i;
        gallery.appendChild(column);
    }
}

function rearrange_images() {
    let columns;

    create_columns(imageDivs.length);
    columns = gallery.querySelectorAll(".column");

    for (let i = 0; i < imageDivs.length; i++)
        columns[i % columns.length].appendChild(imageDivs[i]);

    processButt.innerText = `Process ${imageDivs.length} image${imageDivs.length > 1 ? 's' : ''}`;
}

fileInput.addEventListener("change", () => {
    let columns;

    create_columns(fileInput.files.length + imageDivs.length);
    columns = gallery.querySelectorAll(".column");
    for (let i = 0; i < fileInput.files.length; i++) {
        const img = document.createElement("img");
        const div = document.createElement("div");
        const parag = document.createElement("p");
        const reader = new FileReader();

        reader.readAsDataURL(fileInput.files[i]);
        reader.addEventListener("load", () => {
            img.src = reader.result;

            parag.innerText = "✖";
            parag.classList.add("delet");
            parag.addEventListener("click", () => {
                parag.parentElement.parentElement.removeChild(parag.parentElement);
                imageDivs = imageDivs.filter(div => div.dataset.id != parag.parentElement.dataset.id);
                rearrange_images();
            });

            div.style.position = "relative";
            div.dataset.id = id++;
            div.appendChild(parag);
            div.appendChild(img);
            columns[i % columns.length].appendChild(div);
            imageDivs.push(div);
        });
    }

    for (let i = 0; i < imageDivs.length; i++)
        columns[(fileInput.files.length + i) % columns.length].appendChild(imageDivs[i]);

    let sength = fileInput.files.length + imageDivs.length;
    processButt.innerText = `Process ${sength} image${sength > 1 ? 's' : ''}`;
    processButt.classList.remove("hidden");
});


//https://stackoverflow.com/questions/37953871/how-to-force-repaint-in-js
function processing() {
    requestAnimationFrame(() => {
        loadingScreen.classList.remove("hidden");

        setTimeout(compute, 1);
    });
}

function compute() {
    const inputWidth = document.getElementById("width");
    const inputHeight = document.getElementById("height");
    let width, height, promises;

    width = inputWidth.value ? inputWidth.value : 100;
    height = inputHeight.value ? inputHeight.value : 100;

    set_canvas_dimentions(width, height);

    promises = [];
    for (let div of imageDivs) {
        let img;

        img = div.querySelector("img");
        promises.push(fit_image(img));
    }

    Promise.all(promises).then(values => {
        loadingScreen.classList.add("hidden");
        for (let i = 0; i < values.length; i++)
            imageDivs[i].querySelector("img").src = values[i];

        fileInput.parentElement.classList.add("hidden");
        processButt.classList.add("hidden");
        downloadButt.classList.remove("hidden");
    });
}

processButt.addEventListener("click", processing);

downloadButt.addEventListener("click", () => {
    let zip, folder;

    zip = new JSZip();
    folder = zip.folder("images");
    for (let div of imageDivs) {
        let img;

        img = div.querySelector("img");
        folder.file(name_image(), img.src.split(',')[1], { base64: true });
    }
    zip.generateAsync({ type: "blob" }).then(blob => saveAs(blob, "images_folder"));

    init();
});

init();