// very cool main script for batch transpiler
const fs = require("fs");

function compile(filePath) {
    var file = fs.readFileSync(filePath);
    if (!file) throw new Error("Invalid file path specified!");
    var lines = file.split("\n");
    logToFile(`Loaded file ${filePath} with ${lines} lines.`);
    var outFile = "";

    lines.forEach(_line => {
        /**
         * @type {string}
         */
        var l = _line;
        var lineData = {
            noShowOutput: false,
            args: l.split(" ")
        };
        lineData.args.splice(0, 1);
        // Parse
        if (l.startsWith("@")) {
            l = l.substr(1);
            lineData.noShowOutput = true;
        }
        if (l.startsWith("echo")) {
            if (lineData.args.length == 1 && (lineData.args[0] == "off" || lineData.args[0] == "on")) {
                l = "echo." + lineData.args[0];
            }
        }
    });
}

function logToFile(text) {
    fs.appendFile("betterbatch.log", text.toString());
}