const formatRadix = (input, radix) => {
    if(!input) return "";
    let myString;
    switch (radix) {
        case "hex":
            myString = input.toString(16);
            myString = myString.padStart(myString.length + 8 - myString.length % 8, "0")
            return "16#" + myString;
        case "binary":
            myString = input.toString(2);
            myString = myString.padStart(myString.length + 32 - myString.length % 32, "0")
            return "2#" + myString;
        default:
            myString = input.toString(10);
            return myString
    }
}

export { formatRadix }