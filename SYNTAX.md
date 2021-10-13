# Syntax of BetterBatch
Most of it is the same, but there are a few differences.
## General
All lines now end with a semicolon.
```
echo "Hello World";
```

## Functions
To create a function, use `fn [functionname] [argument list, comma separated] { content }`.
  
  Example:
```
fn showtext arg1, arg2 {
    echo Arg 1: %arg1%;
    echo Arg 2: %arg2%;
}
```
To run a function, you run it as you would any other command:
```
showtext "Hello World" "Argument 2"
```