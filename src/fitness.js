const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

export function set_canvas_dimentions(width, height) {
    canvas.width = width;
    canvas.height = height;
}

// export function fit_image(image) {
//     return new Promise(resolve => {
//         context.clearRect(0, 0, canvas.width, canvas.height);
//         fit(image);
//         resolve(canvas.toDataURL());
//     });
// }

export function fit_image(image) {
    return new Promise((resolve, _) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        fit(image);
        resolve(canvas.toDataURL());
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