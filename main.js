class CompileError extends Error {
    constructor() {
        super("Compiler Error!");
        this.message = "Compiler Error!";
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        //  @see Node.js reference (bottom)
        Error.captureStackTrace(this, this.constructor);
    }
}

// very cool main script for batch transpiler
const fs = require("fs");

function compile(filePath) {
    var file = fs.readFileSync(filePath);
    if (!file) throw new Error("Invalid file path specified!");
    var lines = file.toString().split("\r\n");
    logToFile(`Loaded file ${filePath} with ${lines.length} lines.`);
    var outFile = "";
    var reading = "none";
    var newlineChar = "\n";
    var functionList = "exit /b 1101";
    lines.forEach(_line => {
        /**
         * @type {string}
         */
        var l = _line.trim();
        var noShowOutput = false,
            args = l.split(" ");
        args.splice(0, 1);
        // Parse
        if (l.startsWith("@")) {
            noShowOutput = true;
        }
        if (l.startsWith("echo")) {
            if (args.length == 1 && (args[0] == "off" || args[0] == "on")) {
                l = "echo." + args[0];
            }
        }
        if (l.startsWith("s0")) {
            l = "@echo off";
        }
        if (l.startsWith("s1")) {
            l = "@echo on";
        }
        if (l.startsWith("fn ")) {
            if (reading == "function") throw new CompileError();
            if (args.length == 2) {
                // Function without arguments.
                // Check if syntax is gud
                if (args[1] != "{") {
                    throw new CompileError();
                } else {
                    reading = "function";
                    functionList += "\n:BBSFN_" + args[0] + "\n";
                    l = "//skipline";
                }
            } else l = "rem BBS: Not Supported Yet!";
        }
        if (l == "}") {
            if (reading == "function") {
                functionList += "goto :eof" + newlineChar;
                l = "//skipline";
                reading = "none";
            } else if (reading == "loop") {
                l = ")";
                reading = "none";
            } else throw new CompileError();
        }
        if (l.startsWith("fnrun ")) {
            l = "call :BBSFN_" + args.join(" ");
        }
        if (l.startsWith("loop ")) {
            if (reading == "loop") throw new CompileError();
            if (args.length == 2) {
                // Function without arguments.
                // Check if syntax is gud
                if (args[1] != "{") {
                    throw new CompileError();
                } else {
                    reading = "loop";
                    l = "for /l %%p in (0,1," + (parseInt(args[0]) - 1) + ") do (";
                }
            } else l = "rem BBS: Not Supported Yet!";
        }
        if (l.startsWith("sleep ")) {
            l = "timeout /t " + args[0] + " >nul";
        }
        if (reading == "loop") {
            l = l.replace(/(\$loop)/gm, "%%p");
        }
        // END OF COMMAND SHIT
        if (l.startsWith("//")) {
            return;
        }
        if (reading == "function") {
            functionList += l + newlineChar;
            return;
        }
        outFile += l + newlineChar;
    });
    outFile += functionList;
    outFile = outFile.substr(0, outFile.length - newlineChar.length);
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
theRealArgs = theRealArgs.filter(a => !a.startsWith("-"));
compile(theRealArgs.join(" "));