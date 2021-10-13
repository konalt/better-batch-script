# BetterBatch
A transpiler for batch files to overcome the limitations of the Batch scripting language.
## Why?
Batch has been limited by many things ever since its creation. This changes that.
## How to use this?
Simply run `bbsc [filename]` from the command line, where you have your batch file. You should also have bbsc.exe in there.
## The syntax
Syntax is in [SYNTAX.md](https://github.com/konalt/better-batch-script/blob/main/SYNTAX.md).
## How to build the compiler from source
#### NOTE: This is not needed if you just want to use BetterBatch.
Install nexe using `npm i -g nexe`.

Run `nexe main --build -o bbsc.exe`.

Ya done kid.