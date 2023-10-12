const vscode = require('vscode');
const terminalImage = require('terminal-image');
const fs = require('fs');
const path = require('path');

async function displayGif(gifPath) {

	const gif = await terminalImage.gifFile(gifPath, {width: '10%', height: '10%'});
	const gifFrames = gif.frames;
  
	// Get the terminal dimensions
	const terminalWidth = vscode.window.activeTerminal.dimensions.columns;
	const terminalHeight = vscode.window.activeTerminal.dimensions.rows;
  
	// Initial position at the bottom right corner
	let xPos = terminalWidth - gifFrames[0].width;
	const yPos = terminalHeight - gifFrames[0].height;
  
	for (const frame of gifFrames) {
		const imageData = frame.data;
	
		const imageString = await terminalImage.imageDataToString(imageData);
	
		// Move the cursor to the calculated position
		const cursorTo = `\x1b[${yPos + 1};${xPos + 1}H`;
		vscode.window.activeTerminal.sendText(cursorTo);
	
		// Display the GIF frame - run for each frame of the GIF
		vscode.window.activeTerminal.renderFrame(imageString);
	
		// Move the dog horizontally to the left
		xPos--;
	
		// Wait for a short period of time before displaying the next frame
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
  
	// run when the animation playback is stopped
	vscode.window.activeTerminal.renderFrame.done();
}
  
  async function startGifLoop() {
	const gifFolder = path.join(__dirname, 'img');
	
	while (true) {
		const gifFiles = fs.readdirSync(gifFolder);
		for (const gifFile of gifFiles) {
			const gifPath = path.join(gifFolder, gifFile);
			await displayGif(gifPath);
		  }
  
		// Wait for 1 hour before displaying the next GIF
		await new Promise((resolve) => setTimeout(resolve, 3600000));
	}
  }

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	startGifLoop();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "dog-walk-terminal" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('dog-walk-terminal.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from dog-walk-terminal!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
