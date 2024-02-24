document.addEventListener('DOMContentLoaded', function () {
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

resizeCanvas();

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

window.addEventListener('resize', resizeCanvas);

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = 200;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function downloadSignature() {
    const formatSelect = document.getElementById('formatSelect');
    const selectedFormat = formatSelect.value;

    switch (selectedFormat) {
        case 'pdf':
            downloadSignatureAsPDF();
            break;
        default:
            downloadSignatureAsImage(selectedFormat);
    }
}

function downloadSignatureAsImage(format) {
 
  
    const dataURL = canvas.toDataURL(`image/${format}`);
    const link = document.createElement('a');
    link.href = dataURL;

    link.download = `signature.${format}`;
    link.click();
  
  ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const dataURL = canvas.toDataURL(`image/${format}`);
const link = document.createElement('a');
link.href = dataURL;

link.download = `signature.${format}`;
link.click();


function downloadSignatureAsPDF() {
    const signatureCanvas = document.getElementById('signatureCanvas');
    const signatureRect = signatureCanvas.getBoundingClientRect();

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = signatureRect.width;
    tempCanvas.height = signatureRect.height;

    const centerX = tempCanvas.width / 2;
    const centerY = tempCanvas.height / 2;

    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(signatureCanvas, centerX - signatureRect.width / 2, centerY - signatureRect.height / 2);

    const pdfConfig = {
        margin: 10,
        filename: 'signature.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf(tempCanvas, pdfConfig);
}

// Function to clear the signature canvas
function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// Add this function along with other functions in your script
function resizeCanvas() {
    const canvasSize = Math.min(window.innerWidth * 0.8, 400); // Set a maximum size of 400px for the canvas
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loadManualSignature(input) {
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                // Draw the manual signature on the canvas
                const canvas = document.getElementById('signatureCanvas');
                const ctx = canvas.getContext('2d');

                // Set the canvas background color to white
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Determine the dimensions for drawing the image maintaining aspect ratio
                let drawWidth, drawHeight;

                if (img.width > img.height) {
                    drawWidth = canvas.width;
                    drawHeight = (canvas.width / img.width) * img.height;
                } else {
                    drawHeight = canvas.height;
                    drawWidth = (canvas.height / img.height) * img.width;
                }

                // Center the image on the canvas
                const xOffset = (canvas.width - drawWidth) / 2;
                const yOffset = (canvas.height - drawHeight) / 2;

                ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);

                // Convert the image to black and white while preserving transparency
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    // Convert to black and white (preserve transparency)
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;      // Red
                    data[i + 1] = avg;  // Green
                    data[i + 2] = avg;  // Blue
                    // Preserve the alpha channel
                }

                ctx.putImageData(imageData, 0, 0);
            };
        };

        reader.readAsDataURL(file);
    }
}
});
