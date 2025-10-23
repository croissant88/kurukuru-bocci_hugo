function vigenere(text, key, encrypt = true) {
  const A = "A".charCodeAt(0);
  const Z = "Z".charCodeAt(0);

  key = key.toUpperCase().replace(/[^A-Z]/g, "");
  text = text.toUpperCase().replace(/[^A-Z]/g, "");

  let result = "";
  for (let i = 0, j = 0; i < text.length; i++) {
    const letter = text.charCodeAt(i);
    if (letter >= A && letter <= Z) {
      const shift = key.charCodeAt(j % key.length) - A;
      j++;
      result += String.fromCharCode(
        A + ((encrypt ? letter - A + shift : letter - A - shift + 26) % 26)
      );
    }
  }
  return result;
}

function encrypt() {
  const key = document.getElementById("key").value;
  const inputText = document.getElementById("inputText").value;
  const output = vigenere(inputText, key);
  document.getElementById("output").value = output;
}

function decrypt() {
  const key = document.getElementById("key").value;
  const inputText = document.getElementById("inputText").value;
  const output = vigenere(inputText, key, false);
  document.getElementById("output").value = output;
}
