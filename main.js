// very cool main script for batch transpiler
const fs = require("fs");

function compile(filePath) {
    var file = fs.readFileSync(filePath);
    if (!file) throw new Error("Invalid file path specified!");
    var lines = file.toString().split("\r\n");
    logToFile(`Loaded file ${filePath} with ${lines.length} lines.`);
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
        console.log(lineData.args);
        // Parse
        if (l.startsWith("@")) {
            lineData.noShowOutput = true;
        }
        if (l.startsWith("echo")) {
            if (lineData.args.length == 1 && (lineData.args[0] == "off" || lineData.args[0] == "on")) {
                l = "echo." + lineData.args[0];
            }
        }
        if (l.startsWith("s0")) {
            l = "@echo off";
        }
        if (l.startsWith("s1")) {
            l = "@echo on";
        }
        outFile += l + "\n";
    });
    console.log("Writing file...");
    var outPath = filePath;
    outPath = outPath.split(".");
    outPath.pop();
    outPath.push("bat");
    fs.writeFileSync(outPath.join("."), outFile);
}

function logToFile(text) {
    console.log(text);
    fs.appendFileSync("betterbatch.log", text.toString() + "\n");
}

var theRealArgs = process.argv;
theRealArgs.splice(0, 2);
compile(theRealArgs.join(" "));