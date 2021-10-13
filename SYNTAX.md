# Syntax of BetterBatch
Most of it is the same, but there are a few differences.
## General
`@echo off/on` has been replaced with `s 0/1`.
Using `echo off/on` now uses the intended behaviour, displaying the string `off/on`.
## Functions
To create a function, use `fn [functionname] [argument list, comma separated] { content }`.
  
  Example:
```
fn showtext arg1, arg2 {
    echo Arg 1: %arg1%;
    echo Arg 2: %arg2%;
}
```
To run a function, you run it using `fnrun`:
```
fnrun showtext "Hello World" "Argument 2"
```