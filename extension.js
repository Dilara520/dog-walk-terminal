const vscode = require('vscode');
const ansiEscapes = require('ansi-escapes');
const terminalImage = require('terminal-image');

async function displayGif(gifPath) {
	const gif = await terminalImage.load(gifPath);
	const gifFrames = gif.frames;
  
	for (const frame of gifFrames) {
	  const imageData = frame.data;
	  const imageString = await terminalImage.imageDataToString(imageData);
  
	  // Clear the terminal
	  vscode.window.activeTerminal.sendText(ansiEscapes.clearScreen);
  
	  // Display the GIF frame
	  vscode.window.activeTerminal.sendText(ansiEscapes.cursorTo(0, 0));
	  vscode.window.activeTerminal.sendText(imageString);
  
	  // Wait for a short period of time before displaying the next frame
	  await new Promise((resolve) => setTimeout(resolve, 100));
	}
  }

  async function startGifLoop() {
	const gifPaths = [
	  // Path to the first GIF
	  // Path to the second GIF
	  // ...
	];
  
	while (true) {
	  for (const gifPath of gifPaths) {
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
