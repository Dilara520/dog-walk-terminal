const vscode = require('vscode');
const terminalImage = require('terminal-image');
const fs = require('fs');
const path = require('path');

let gifInterval;

async function displayGif(gifPath) {

	const gif = await terminalImage.gifFile(gifPath, {width: '10%', height: '10%'});
	const gifFrames = gif.frames;
  
	// Get the terminal dimensions
	const terminalWidth = vscode.window.activeTerminal.dimensions.columns;
	const terminalHeight = vscode.window.activeTerminal.dimensions.rows;
  
	// Initial position at the bottom left corner
    let xPos = 0;
    const yPos = terminalHeight - gifFrames[0].height;
	
	// Move the cursor to the calculated position
	const cursorTo = `\x1b[${yPos + 1};${xPos + 1}H`;
	vscode.window.activeTerminal.sendText(cursorTo);
  
	for (const frame of gifFrames) {
		const imageData = frame.data;
	
		const imageString = await terminalImage.imageDataToString(imageData);
	
		// Display the GIF frame - run for each frame of the GIF
		vscode.window.activeTerminal.renderFrame(imageString);
	
		// Move the GIF horizontally to the right
		xPos++;
		if (xPos + gifFrames[0].width > terminalWidth) {
            xPos = 0;
        }
	
		// Wait for a short period of time before displaying the next frame
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	// Clear the line where the GIF was displayed
    const clearLine = `\x1b[${yPos + 1};0H\x1b[K`;
    vscode.window.activeTerminal.sendText(clearLine);
}

function moveGif(gifPath) {
    gifInterval = setInterval(() => {
        displayGif(gifPath);
    }, 1800000);
}

function stopGif() {
    clearInterval(gifInterval);
}

vscode.window.onDidCloseTerminal((terminal) => {
    if (terminal === vscode.window.activeTerminal) {
        stopGif();
    }
});
  
async function startGifLoop() {
	const gifFolder = path.join(__dirname, 'img');
	
	while (true) {
		const gifFiles = fs.readdirSync(gifFolder);
		for (const gifFile of gifFiles) {
			const gifPath = path.join(gifFolder, gifFile);
            moveGif(gifPath);
            await new Promise((resolve) => setTimeout(resolve, 1800000)); // Wait for 30 min before displaying the next GIF
            stopGif();
		}
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate() {
	startGifLoop();
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
