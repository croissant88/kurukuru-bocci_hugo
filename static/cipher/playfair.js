function generatePlayfairKey(key) {
  const matrix = [];
  const size = 5;
  let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // 'J' is merged with 'I'
  const used = new Set();

  // Fill key into matrix
  for (const char of key.toUpperCase()) {
    if (!used.has(char) && alphabet.includes(char)) {
      matrix.push(char);
      used.add(char);
    }
  }

  // Fill remaining alphabet into matrix
  for (const char of alphabet) {
    if (!used.has(char)) {
      matrix.push(char);
    }
  }

  // Convert flat matrix to 2D
  return Array.from({ length: size }, (_, i) =>
    matrix.slice(i * size, i * size + size)
  );
}

function preprocessText(text) {
  text = text.toUpperCase().replace(/J/g, "I").replace(/\s/g, "");
  if (text.length % 2 !== 0) {
    text += "X"; // Padding if the length of text is odd
  }
  const digraphs = [];
  for (let i = 0; i < text.length; i += 2) {
    digraphs.push(text.substr(i, 2));
  }
  return digraphs;
}

function findPosition(char, matrix) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === char) {
        return { row, col };
      }
    }
  }
  return null;
}

function playfairEncrypt(digraphs, matrix) {
  const encrypted = [];
  for (const di of digraphs) {
    const pos1 = findPosition(di[0], matrix);
    const pos2 = findPosition(di[1], matrix);

    // Same row
    if (pos1.row === pos2.row) {
      encrypted.push(matrix[pos1.row][(pos1.col + 1) % 5]);
      encrypted.push(matrix[pos2.row][(pos2.col + 1) % 5]);
    }
    // Same column
    else if (pos1.col === pos2.col) {
      encrypted.push(matrix[(pos1.row + 1) % 5][pos1.col]);
      encrypted.push(matrix[(pos2.row + 1) % 5][pos2.col]);
    }
    // Rectangle
    else {
      encrypted.push(matrix[pos1.row][pos2.col]);
      encrypted.push(matrix[pos2.row][pos1.col]);
    }
  }
  return encrypted.join("");
}

function encrypt() {
  const text = document.getElementById("inputText").value;
  const key = document.getElementById("inputKey").value;
  const matrix = generatePlayfairKey(key);
  const digraphs = preprocessText(text);
  const encryptedText = playfairEncrypt(digraphs, matrix);
  document.getElementById("result").innerText = encryptedText;
}

function playfairDecrypt(digraphs, matrix) {
  const decrypted = [];
  for (const di of digraphs) {
    const pos1 = findPosition(di[0], matrix);
    const pos2 = findPosition(di[1], matrix);

    // Same row, shift columns to left
    if (pos1.row === pos2.row) {
      decrypted.push(matrix[pos1.row][(pos1.col + 4) % 5]); // +4 is same as -1 modulo 5
      decrypted.push(matrix[pos2.row][(pos2.col + 4) % 5]);
    }
    // Same column, shift rows up
    else if (pos1.col === pos2.col) {
      decrypted.push(matrix[(pos1.row + 4) % 5][pos1.col]);
      decrypted.push(matrix[(pos2.row + 4) % 5][pos2.col]);
    }
    // Rectangle, swap columns
    else {
      decrypted.push(matrix[pos1.row][pos2.col]);
      decrypted.push(matrix[pos2.row][pos1.col]);
    }
  }
  return decrypted.join("");
}

function decrypt() {
  const text = document.getElementById("inputText").value;
  const key = document.getElementById("inputKey").value;
  const matrix = generatePlayfairKey(key);
  const digraphs = preprocessText(text);
  const decryptedText = playfairDecrypt(digraphs, matrix);
  document.getElementById("result").innerText = decryptedText;
}

// Sample usage:
const key = "PLAYFAIR";
const text = "HELLO";
const matrix = generatePlayfairKey(key);
const digraphs = preprocessText(text);
const encryptedText = playfairEncrypt(digraphs, matrix);
console.log(encryptedText); // Should output the encrypted text
