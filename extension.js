// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const cp = require("child_process");
const fs = require("fs");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "refine-c" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "refine-c.refine",
    function() {
      // The code you place here will be executed every time your command is executed
      const currentWorkingFile = vscode.window.activeTextEditor.document;
      const enableLanguage = vscode.workspace
        .getConfiguration("refine-c")
        .get("enableLanguages");
      // console.log(enableLanguage);

      // Check refineLanguage
      let refineLang = vscode.workspace
        .getConfiguration("refine-c")
        .get("refineLanguage");
      const supportLang = [
        "none",
        "c",
        "c-header",
        "c++",
        "c++-header",
        "objective-c",
        "objective-c-header",
        "objective-c++",
        "objective-c++-header"
      ];
      if (supportLang.indexOf(refineLang) === -1) refineLang = "none";

      // Check for documentLanguage
      if (
        currentWorkingFile.languageId === "c" ||
        currentWorkingFile.languageId === "cpp" ||
        currentWorkingFile.languageId === "objective-c" ||
        currentWorkingFile.languageId === "objective-cpp" ||
        enableLanguage.indexOf(currentWorkingFile.languageId) !== -1
      ) {
        if (!currentWorkingFile) {
          vscode.window.showInformationMessage("No file was chosen!");
          return;
        }
        if (currentWorkingFile.isUntitled || currentWorkingFile.isDirty) {
          vscode.window.showInformationMessage("Your file was not saved!");
          return;
        }
        const fileName = (currentWorkingFile.fileName);

        // Executing
        const execLine =
          "gcc -E -CC -P -undef -dI -nostdinc -x " +
          refineLang +
          ' "' +
          fileName +
          '"';
        console.log(execLine);
        cp.exec(execLine, (err, stdout, stderr) => {
          if (stderr) vscode.window.showInformationMessage("Problem: ", stderr);
          fs.writeFile(fileName, stdout);
        });

        // Display a message box to the user
        vscode.window.showInformationMessage("Your code has been refined!");
      } else vscode.window.showInformationMessage("Language is not supported!");
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
