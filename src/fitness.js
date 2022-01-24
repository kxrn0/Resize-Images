const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

export function set_canvas_dimentions(width, height) {
    canvas.width = width;
    canvas.height = height;
}

//thanks to anon from 4chan.org/g/ for helping me figure out promises
export function fit_image(source) {
    return new Promise(resolve => {
        let image = new Image();
        image.src = source;
        image.addEventListener("load", () => {
            fit(image);
            resolve(canvas.toDataURL());
        });
    });
}

function fit(image) {
    let ratio = image.height / image.width;
    let imageData;

    if (ratio < canvas.height / canvas.width) {
        if (image.width > image.height) {
            let bgWidth = canvas.height / ratio;
            context.drawImage(image, -bgWidth / 4, 0, bgWidth, canvas.height);
        }
        else {
            let bgWidth = 2 * canvas.width;
            let bgHeight = bgWidth * ratio;
            context.drawImage(image, .5 * (canvas.width - bgWidth), .5 * (canvas.height - bgHeight), bgWidth, bgHeight);
        }

        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        blur(imageData, 13);

        let height = canvas.width * ratio;
        context.drawImage(image, 0, .5 * (canvas.height - height), canvas.width, height);
    }
    else {
        let bgHeight = canvas.width * ratio;
        context.drawImage(image, 0, .5 * (canvas.height - bgHeight), canvas.width, bgHeight);

        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        blur(imageData, 13);

        let width = canvas.height / ratio;
        context.drawImage(image, .5 * (canvas.width - width), 0, width, canvas.height);
    }
}

function blur(imageData, kWidth) {
    let blurred = new Uint8ClampedArray(canvas.width * canvas.height * 4);
    let scannedData = imageData.data;
    let demon = Math.floor(kWidth / 2);

    for (let x = 0; x < canvas.width; x++)
        for (let y = 0; y < canvas.height; y++) {
            let avgRed, avgGreen, avgBlue;

            avgRed = 0;
            avgGreen = 0;
            avgBlue = 0;

            for (let kx = -demon; kx <= demon; kx++)
                for (let ky = -demon; ky <= demon; ky++) {
                    let dx, dy;

                    dx = 4 * (x + kx);
                    dy = 4 * (y + ky);

                    let index = dy * canvas.width + dx;
                    if (0 <= index && index < scannedData.length) {
                        avgRed += scannedData[index];
                        avgGreen += scannedData[index + 1];
                        avgBlue += scannedData[index + 2];
                    }
                }
            avgRed /= kWidth * kWidth;
            avgGreen /= kWidth * kWidth;
            avgBlue /= kWidth * kWidth;

            let index = 4 * (canvas.width * y + x);

            blurred[index] = avgRed;
            blurred[index + 1] = avgGreen;
            blurred[index + 2] = avgBlue;
            blurred[index + 3] = scannedData[index + 3];
        }

    for (let i = 0; i < blurred.length; i++)
        scannedData[i] = blurred[i];

    context.putImageData(imageData, 0, 0);
}

// export function random(a, b) {
//     return a + Math.random() * (b - a);
// }

// export function map(value, start1, end1, start2, end2) {
//     return start2 + (end2 - start2) * (value - start1) / (end1 - start1);
// }
// export class Vector {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//         this.length = Math.sqrt(this.x * this.x + this.y * this.y);
//         this.angle = Math.atan2(this.y, this.x);
//     }

//     add(vec) {
//         this.x += vec.x;
//         this.y += vec.y
//         this.length = Math.sqrt(this.x * this.x + this.y * this.y);
//         this.angle = Math.atan2(this.y, this.x);
//     }

//     subs(vec) {
//         this.x -= vec.x;
//         this.y -= vec.y;
//         this.length = Math.sqrt(this.x * this.x + this.y * this.y);
//         this.angle = Math.atan2(this.y, this.x);
//     }

//     dot(vec) {
//         return this.x * vec.x + this.y * vec.y;
//     }

//     mult(value) {
//         this.x *= value;
//         this.y *= value;
//     }

//     static add(vec1, vec2) {
//         return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
//     }

//     static subs(vec1, vec2) {
//         return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
//     }

//     static dot(vec1, vec2) {
//         return vec1.x * vec2.x + vec1.y + vec2.y;
//     }

//     static vector_from_angle(angle, mag = 1) {
//         return new Vector(mag * Math.cos(angle), mag * Math.sin(angle));
//     }

//     static random_vector(mag = 1) {
//         return new Vector(mag * Math.cos(random(0, 2 * Math.PI)), mag * Math.sin(random(0, Math.PI * 2)));
//     }
// }