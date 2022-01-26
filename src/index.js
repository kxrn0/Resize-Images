import "./style.css";
import { set_canvas_dimentions, fit_image } from "./fitness";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const fileInput = document.getElementById("file-input");
const processButt = document.querySelector(".process");
const downloadButt = document.querySelector(".download-images");
const gallery = document.querySelector(".gallery");
let columns, id = 0;
let imageDivs = [], imageData = [];

fileInput.addEventListener("change", () => {
    if (!columns) {
        columns = fileInput.files.length > 3 ? 4 : fileInput.files.length;
        for (let i = 0; i < columns; i++) {
            const column = document.createElement("div");
            column.classList.add("column");
            column.style.flex = `${100 / columns}`;
            column.style.maxWidth = `${100 / columns}`;
            column.dataset.number = i;
            gallery.appendChild(column);
        }
    }

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
            });

            div.style.position = "relative";
            div.dataset.id = id;
            div.appendChild(parag);
            div.appendChild(img);
            document.querySelector(`[data-number="${id++ % columns}"]`).appendChild(div);
            imageDivs.push(div);

            if (i == fileInput.files.length - 1) {
                processButt.innerText = `Process ${imageDivs.length} image${imageDivs.length > 1 ? 's' : ''}`;
            }
        });
    }

    processButt.classList.remove("hidden");
});

processButt.addEventListener("click", () => {
    const inputWidth = document.getElementById("width");
    const inputHeight = document.getElementById("height");
    const loadingScreen = document.querySelector(".loading-screen");
    let width, height, count;

    loadingScreen.classList.remove("hidden");

    width = inputWidth.value ? inputWidth.value : 100;
    height = inputHeight.value ? inputHeight.value : 100;
    count = 0;

    set_canvas_dimentions(width, height);

    let promises;

    promises = [];
    for (let div of imageDivs) {
        let img;

        img = div.querySelector("img");
        promises.push(fit_image(img));
    }

    Promise.all(promises).then(values => {
        loadingScreen.classList.add("hidden");
        for (let i = 0; i < values.length; i++) {
            imageDivs[i].querySelector("img").src = values[i];
            imageData.push(values[i])
        }

        fileInput.parentElement.classList.add("hidden");
        processButt.classList.add("hidden");    
        downloadButt.classList.remove("hidden");    
    });
});

downloadButt.addEventListener("click", () => {
    let zip, folder;

    zip = new JSZip();
    folder = zip.folder("images");
    for (let image of imageData) {
        let name;

        name = "image_"
        for (let i = 0; i < 6; i++)
            name += Math.floor(Math.random() * 10);
        folder.file(name, image.split(',')[1], { base64 : true });
    }

    zip.generateAsync({ type : "blob" }).then(blob => saveAs(blob, "images_folder"));

    downloadButt.classList.add("hidden");
    gallery.innerHTML = '';
    fileInput.classList.remove("hidden");
    processButt.classList.remove("hidden");
});