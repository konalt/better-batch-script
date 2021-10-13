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
    var isReadingFunction = false;
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
        if (l.startsWith("fn")) {
            if (args.length == 2) {
                // Function without arguments.
                // Check if syntax is gud
                if (args[1] != "{") {
                    throw new CompileError();
                } else {
                    isReadingFunction = true;
                    l = "exit /b 1101\n:BBSFN_" + args[0];
                }
            } else l = "rem BBS: Not Supported Yet!";
        }
        if (l == "}") {
            if (isReadingFunction) {
                l = "goto :eof";
                isReadingFunction = false;
            } else throw new CompileError();
        }
        if (l == "fnrun") {
            l = "call :BBSFN_" + args.join(" ");
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
theRealArgs = theRealArgs.filter(a => !a.startsWith("-"));
compile(theRealArgs.join(" "));