function encrypt() {
  const message = document.getElementById("message").value;
  const shift = parseInt(document.getElementById("shift").value);
  document.getElementById("cipherResult").textContent = caesarCipher(
    message,
    shift
  );
}

function decrypt() {
  const message = document.getElementById("message").value;
  const shift = parseInt(document.getElementById("shift").value);
  document.getElementById("cipherResult").textContent = caesarCipher(
    message,
    -shift
  );
}

function caesarCipher(str, shift) {
  return str
    .split("")
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        let code = char.charCodeAt();
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
      }
      return char;
    })
    .join("");
}
// decryptAuto 関数を修正
function decryptAuto() {
  let encryptedMessage = document.getElementById("autoDecryptTextarea").value; // テキストエリアの値を取得
  let bestShift = 0;
  let bestDecodedMessage = "";
  let highestLetterCount = 0;

  for (let shift = 0; shift < 26; shift++) {
    let decodedMessage = decodeCaesarCipher(encryptedMessage, shift);
    let letterCount = countCommonWords(decodedMessage);

    if (letterCount > highestLetterCount) {
      highestLetterCount = letterCount;
      bestDecodedMessage = decodedMessage;
      bestShift = shift;
    }
  }

  document.getElementById(
    "result"
  ).innerText = `Best Shift: ${bestShift}\nDecoded Message: ${bestDecodedMessage}`;
}

function decodeCaesarCipher(text, shift) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.match(/[a-z]/i)) {
      let code = text.charCodeAt(i);
      let shiftCode = code - shift;
      if (code >= 65 && code <= 90 && shiftCode < 65) shiftCode += 26;
      if (code >= 97 && code <= 122 && shiftCode < 97) shiftCode += 26;
      char = String.fromCharCode(shiftCode);
    }
    result += char;
  }
  return result;
}

function countCommonWords(text) {
  // ここで最も一般的な英単語の数をカウントする
  // 例: "the", "be", "to", "of", "and", "a", "in", "that", "have", "I"
  // 実際にはもっと複雑な方法で行うことが望ましい
  let commonWords = [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "I",
  ];
  let count = 0;
  commonWords.forEach((word) => {
    if (text.includes(word)) count++;
  });
  return count;
}

// "Decrypt Auto"の結果をコピーするための関数
function copyAutoResultToClipboard() {
  var text = document.getElementById("result").innerText;
  navigator.clipboard
    .writeText(text)
    .then(function () {
      console.log("Text copied to clipboard");
    })
    .catch(function (err) {
      console.error("Could not copy text: ", err);
    });
}

// "Decrypt Auto"の結果をクリアするための関数
function clearAutoResult() {
  document.getElementById("result").innerText = "";
}

// 通常の暗号化結果をコピーするための関数
function copyCipherResultToClipboard() {
  const text = document.getElementById("cipherResult").innerText;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}

// 通常の暗号化結果をクリアするための関数
function clearCipherResult() {
  document.getElementById("cipherResult").innerText = "";
}

// app.js の既存のコード
// ...

// トースト表示機能を追加する
function showToast(message) {
  const toastContainer = document.getElementById("copyToast");
  const toastBody = toastContainer.querySelector(".toast-body");
  toastBody.textContent = message; // トーストメッセージの内容を設定

  // Bootstrap 5のトーストインスタンスを生成して表示
  var toast = new bootstrap.Toast(toastContainer);
  toast.show();
}

// コピー関数を修正
function copyCipherResultToClipboard() {
  const text = document.getElementById("cipherResult").innerText;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
      // トーストを表示する
      showToast("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
      // エラーのトーストを表示する
      showToast("Failed to copy text.");
    });
}

// AutoResult
function copyAutoResultToClipboard() {
  // autoDecryptTextareaのテキストエリアからテキストを取得
  const text = document.getElementById("autoDecryptTextarea").value;
  // クリップボードにテキストをコピー
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Auto decrypt result copied to clipboard");
      // トーストメッセージを表示する関数を呼び出す
      showToast("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
      // エラートーストメッセージを表示する関数を呼び出す
      showToast("Failed to copy text.");
    });
}
