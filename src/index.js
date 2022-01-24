import "./style.css";
import { fun } from "./test"

const fileInput = document.getElementById("file-input");
const processButt = document.querySelector(".process");
let columns, id = 0;
let imageDivs = [];

fileInput.addEventListener("change", () => {
    if (!columns) {
        columns = fileInput.files.length > 3 ? 4 : fileInput.files.length;
        for (let i = 0; i < columns; i++) {
            const column = document.createElement("div");
            column.classList.add("column");
            column.style.flex = `${100 / columns}`;
            column.style.maxWidth = `${100 / columns}`;
            column.dataset.number = i;
            document.querySelector(".gallery").appendChild(column);
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
        });
    }

    processButt.innerText = `Process ${fileInput.files.length} images`;
    processButt.classList.remove("hidden");
});

processButt.addEventListener("click", () => {

    

    //--------------------------------------------------------------------------------------

    //fun();
    
    //CREATE A CANVAS
    //DRAW A BUNCH OF LINES ON IT
    //GET THE BASE64 STRING OF THE DATA IMAGE
    //REPLACE THE SECOND IMAGE IN THE GALLERY WITH THE BASE64 DATA

    // const canvas = document.createElement("canvas");
    // const context = canvas.getContext("2d");

    // canvas.width = 500;
    // canvas.height = 500;

    // for (let i = 0; i < 100; i++) {
    //     let x, y;

    //     x = Math.floor(Math.random() * canvas.width);
    //     y = Math.floor(Math.random() * canvas.height);
    //     context.moveTo(x, y);
    //     x = Math.floor(Math.random() * canvas.width);
    //     y = Math.floor(Math.random() * canvas.height);
    //     context.lineTo(x, y);
    //     context.stroke();
    // }

    /**
     * GET THE DIV THAT YOU WANT TO CHANGE THE IMAGE FROM
     * CHANGE THE src ATTRIBUTE OF THE IMAGE ELEMENT INSIDE THAT DIV
     */
    // const img = document.querySelector("[data-id='6']").querySelector("img");
    // img.src = canvas.toDataURL();
});