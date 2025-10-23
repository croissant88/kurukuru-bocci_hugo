const app = new Vue({
  el: "#app",
  data: {
    modes: [
      {
        key: "caesar",
        name: "Caesar",
      },
      {
        key: "vigenere",
        name: "Vigenere",
      },
      {
        key: "transposition",
        name: "Transposition",
      },
      {
        key: "playfair",
        name: "Playfair",
      },
    ],
    mode: "caesar",
    message: "",
    key: "",
    num_rails: 2,
    encrypt: 1,
    max: 25,
    en_words: [
      "at",
      "by",
      "for",
      "from",
      "in",
      "of",
      "on",
      "to",
      "with",
      "the",
      "that",
      "this",
      "it",
      "good",
      "is",
      "I",
      "you",
      "thanks",
      "love",
      "she",
      "he",
      "we",
      "us",
      "like",
      "me",
      "no",
      "yes",
      "hello",
      "happy",
    ],
  },
  created() {
    const hash = decodeURI(location.hash);
    this.message = hash.replace("#", "");
    if (this.english_message) {
      this.encrypt = 0;
    }
  },
  computed: {
    shifted_messages: function () {
      const shifted_messages = [];
      const max = this.max;
      const encrypt = this.encrypt == 1 ? 1 : -1;
      for (let i = 1; i <= max; i++) {
        const shifted_message = this.caesarCipher(this.message, i * encrypt);
        shifted_messages.push(shifted_message);
      }
      return shifted_messages;
    },
    english_message: function () {
      return this.shifted_messages.find((message) => this.hasEnglish(message));
    },
  },
  methods: {
    caesarCipher(str, shift) {
      // 入力された文字列を全て小文字に変換
      str = str.toLowerCase();

      return str
        .split("")
        .map((char) => {
          if (char.match(/[a-z]/)) {
            // 小文字のアルファベットにのみ処理を適用
            let code = char.charCodeAt();
            // シフト処理を適用し、範囲内に収まるように調整
            let shifted = (code - 97 + shift) % 26;
            // シフト処理で範囲を超えた場合の対応
            if (shifted < 0) shifted += 26;
            shifted += 97;
            // 文字コードから文字に変換
            return String.fromCharCode(shifted);
          }
          // アルファベット以外の文字はそのまま保持
          return char;
        })
        .join("");
    },

    vigenereCipher(text, key, encrypt = 1) {
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
            A +
              ((encrypt == 1 ? letter - A + shift : letter - A - shift + 26) %
                26)
          );
        }
      }
      return result;
    },

    transpositionCipher(text, num_rails, encrypt = 1) {
      let rail = Array.from({ length: num_rails }, () => []);
      let direction = encrypt != 1;
      let row = 0;

      for (let i = 0; i < text.length; i++) {
        rail[row] && rail[row].push(text[i]);
        if (row === 0 || row === num_rails - 1) direction = !direction;
        row += direction ? 1 : -1;
      }

      return rail.flat().join("");
    },

    playfairCipher(text, key, encrypt = 1) {
      function generatePlayfairKey(key) {
        let matrix = [];
        const size = 5;
        const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // 'J' is merged with 'I'
        let used = new Set();

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
          matrix.slice(i * size, (i + 1) * size)
        );
      }

      function preprocessText(text) {
        // Filtering out non-English alphabet characters
        text = text
          .replace(/[^a-zA-Z]/g, "")
          .toUpperCase()
          .replace("J", "I");
        if (text.length % 2 !== 0) {
          text += "X"; // Padding if the length of text is odd
        }
        return text.match(/.{1,2}/g);
      }

      function findPosition(char, matrix) {
        for (let row = 0; row < matrix.length; row++) {
          const col = matrix[row].indexOf(char);
          if (col !== -1) {
            return [row, col];
          }
        }
        return null;
      }

      function playfairEncrypt(digraphs, matrix) {
        let encrypted = [];
        for (const di of digraphs) {
          const pos1 = findPosition(di[0], matrix);
          const pos2 = findPosition(di[1], matrix);

          // Same row
          if (pos1[0] === pos2[0]) {
            encrypted.push(matrix[pos1[0]][(pos1[1] + 1) % 5]);
            encrypted.push(matrix[pos2[0]][(pos2[1] + 1) % 5]);
          }
          // Same column
          else if (pos1[1] === pos2[1]) {
            encrypted.push(matrix[(pos1[0] + 1) % 5][pos1[1]]);
            encrypted.push(matrix[(pos2[0] + 1) % 5][pos2[1]]);
          }
          // Rectangle
          else {
            encrypted.push(matrix[pos1[0]][pos2[1]]);
            encrypted.push(matrix[pos2[0]][pos1[1]]);
          }
        }
        return encrypted.join("");
      }

      function playfairDecrypt(digraphs, matrix) {
        let decrypted = [];
        for (const di of digraphs) {
          const pos1 = findPosition(di[0], matrix);
          const pos2 = findPosition(di[1], matrix);

          // Same row
          if (pos1[0] === pos2[0]) {
            decrypted.push(matrix[pos1[0]][(pos1[1] + 4) % 5]); // +4 is same as -1 modulo 5
            decrypted.push(matrix[pos2[0]][(pos2[1] + 4) % 5]);
          }
          // Same column
          else if (pos1[1] === pos2[1]) {
            decrypted.push(matrix[(pos1[0] + 4) % 5][pos1[1]]);
            decrypted.push(matrix[(pos2[0] + 4) % 5][pos2[1]]);
          }
          // Rectangle
          else {
            decrypted.push(matrix[pos1[0]][pos2[1]]);
            decrypted.push(matrix[pos2[0]][pos1[1]]);
          }
        }
        return decrypted.join("");
      }

      const matrix = generatePlayfairKey(key);
      const digraphs = preprocessText(text);
      if (encrypt === 1) {
        return playfairEncrypt(digraphs, matrix);
      } else {
        return playfairDecrypt(digraphs, matrix);
      }
    },

    hasEnglish: function (message) {
      // 句読点を削除する
      const cleanedMessage = message.replace(
        /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
        ""
      );
      return this.en_words.some((en_word) =>
        cleanedMessage.split(" ").includes(en_word)
      );
    },

    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("copied!");
          alert("copied!");
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
  watch: {
    message(val) {
      location.hash = val;
    },
  },
});
