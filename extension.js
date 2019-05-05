// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const cp = require("child_process");
// Futur use ?
const { EOL } = require("os");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let _channel = vscode.window.createOutputChannel("Refine - Log");

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"refine-c" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        "refine-c.refine",
        function() {
            // The code you place here will be executed every time your command is executed
            // Current Working File
            const cwf = vscode.window.activeTextEditor.document;
            const enableLanguage = vscode.workspace
                .getConfiguration("refine-c")
                .get("enableLanguages");
            const executable = vscode.workspace
                .getConfiguration("refine-c")
                .get("executable");

            // Check refineLanguage
            let refineLang = vscode.workspace
                .getConfiguration("refine-c")
                .get("refineLanguage");
            const supportLangParam = [
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
            if (supportLangParam.indexOf(refineLang) === -1)
                refineLang = "none"; // auto

            // Check for documentLanguage
            const supportLangId = [
                "c",
                "cpp",
                "objective-c",
                "objective-cpp"
            ].concat(enableLanguage);
            if (!cwf) {
                vscode.window.showInformationMessage("No file was chosen!");
                return;
            }
            if (supportLangId.indexOf(cwf.languageId) !== -1) {
                if (cwf.isUntitled || cwf.isDirty) {
                    return vscode.window.showWarningMessage(
                        "Your file is required to be saved before refining!"
                    );
                }
                const fileName = cwf.fileName;

                // Executing
                const process = cp.spawn(executable, [
                    "-E",
                    "-CC",
                    "-P",
                    "-undef",
                    "-dI",
                    "-nostdinc",
                    "-x",
                    refineLang,
                    fileName
                ]);

                process.stderr.on("data", (data) => {
                    vscode.window.showErrorMessage(
                        "There're some errors while refining!"
                    );
                    data.toString()
                        .split(EOL)
                        .forEach(_channel.appendLine);
                });

                process.stdout.on("data", (stdout) => {
                    let refinedDoc = stdout.toString();
                    // Need some test related to EOF in refinedDoc

                    let oldRange = new vscode.Range(0, 0, cwf.lineCount, 0);
                    oldRange = cwf.validateRange(oldRange);

                    const edit = new vscode.WorkspaceEdit();
                    edit.replace(cwf.uri, oldRange, refinedDoc);
                    return vscode.workspace
                        .applyEdit(edit)
                        .then(() =>
                            vscode.window.showInformationMessage(
                                "Your code has been refined!"
                            )
                        );
                });
            } else
                vscode.window.showWarningMessage("Language is not supported!");
        }
    );

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
