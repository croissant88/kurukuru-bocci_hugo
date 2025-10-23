function rail_fence_cipher_encrypt(text, num_rails) {
  let rail = Array.from({ length: num_rails }, () => []);
  let direction = false;
  let row = 0;

  for (let i = 0; i < text.length; i++) {
    rail[row].push(text[i]);
    if (row === 0 || row === num_rails - 1) direction = !direction;
    row += direction ? 1 : -1;
  }

  return rail.flat().join("");
}

function encryptText() {
  let text = document.getElementById("inputText").value;
  let numRails = parseInt(document.getElementById("numRails").value);
  let encryptedText = rail_fence_cipher_encrypt(text, numRails);
  document.getElementById("encryptedText").innerText = encryptedText;
}
