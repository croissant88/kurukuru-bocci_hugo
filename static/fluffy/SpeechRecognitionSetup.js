let isMicrophoneOn = false; // 初期状態はオフ

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = "ja-JP";

recognition.onerror = function (event) {
  console.error("音声認識エラー:", event.error);
  updateChat("音声認識エラーが発生しました: " + event.error, true);
};

recognition.onend = function () {
  if (!isMicrophoneOn) {
    updateChat("※マイクがオフになっています！", "alert-warning", true);
  }
};

function toggleMicrophone() {
  isMicrophoneOn = !isMicrophoneOn;

  if (isMicrophoneOn) {
    recognition.start();
  } else {
    recognition.stop();
  }

  updateMicrophoneButton();
}

function updateMicrophoneButton() {
  const micButton = document.getElementById("micToggle");
  const micIcon = micButton.querySelector("i");

  if (isMicrophoneOn) {
    micButton.classList.add("btn-primary");
    micButton.classList.remove("btn-outline-primary");
    micIcon.classList.add("bi-mic-fill");
    micIcon.classList.remove("bi-mic-mute");
  } else {
    micButton.classList.add("btn-outline-primary");
    micButton.classList.remove("btn-primary");
    micIcon.classList.add("bi-mic-mute");
    micIcon.classList.remove("bi-mic-fill");
  }
}

function updateChat(text, isFinal) {
  const chatContainer = document.getElementById("chatContainer");
  if (isFinal) {
    const newMessage = document.createElement("p");
    newMessage.textContent = text;
    chatContainer.appendChild(newMessage);
  } else {
    const lastParagraph = chatContainer.querySelector("p:last-of-type");
    if (lastParagraph && !lastParagraph.classList.contains("final")) {
      lastParagraph.textContent = text;
    } else {
      const interimMessage = document.createElement("p");
      interimMessage.textContent = text;
      interimMessage.classList.add("interim");
      chatContainer.appendChild(interimMessage);
    }
  }
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
function showStatusMessage(message) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.textContent = message;
  statusMessage.style.display = "block"; // メッセージを表示
}

function hideStatusMessage() {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.style.display = "none"; // メッセージを非表示
}

function copyTextFromContainer() {
  // コピー対象のテキストを含む要素を取得
  var copyText = document.getElementById("chatContainer").innerText;
  // テキストエリアを動的に作成
  var textArea = document.createElement("textarea");
  textArea.value = copyText;
  document.body.appendChild(textArea);
  // テキストエリアを選択
  textArea.select();
  // 選択したテキストをクリップボードにコピー
  document.execCommand("copy");
  // テキストエリアを削除
  document.body.removeChild(textArea);
  // ユーザーにコピーが成功したことを通知（オプション）
  alert("コピーしました: " + copyText);
}

function clearText() {
  const chatContainer = document.getElementById("chatContainer");
  chatContainer.innerHTML = "";
}

// function clearText() {
//   var container = document.getElementById("chatContainer");
//   container.classList.add("fading-out"); // アニメーションクラスを適用

//   container.addEventListener(
//     "animationend",
//     function () {
//       container.innerHTML = ""; // テキストをクリア
//       container.classList.remove("fading-out"); // アニメーションクラスを削除
//     },
//     { once: true }
//   );
// }

///---マイク
document.addEventListener("DOMContentLoaded", function () {
  updateMicrophoneButton();
});

//スピード重視か精度重視か

// グローバル変数で現在のモードを追跡
let isAccuracyMode = true; // デフォルトは精度モード

document.addEventListener("DOMContentLoaded", function () {
  // ラジオボタンの状態に基づいてモードを更新
  document
    .getElementById("flexRadioDefault1")
    .addEventListener("change", function () {
      isAccuracyMode = this.checked;
    });
  document
    .getElementById("flexRadioDefault2")
    .addEventListener("change", function () {
      isAccuracyMode = !this.checked;
    });

  // 初期状態を更新
  updateModeDisplay();
});

recognition.onresult = function (event) {
  let transcript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (!isAccuracyMode || event.results[i].isFinal) {
      transcript += event.results[i][0].transcript;
      updateChat(transcript, event.results[i].isFinal);
    }
  }
};

///スピード重視
function updateChat(text, isFinal) {
  const chatContainer = document.getElementById("chatContainer");
  let lastParagraph = chatContainer.querySelector("p:last-of-type");

  // 最終結果でない場合は、最後の段落を更新（または新しい中間結果を作成）
  if (!isFinal) {
    if (lastParagraph && lastParagraph.classList.contains("interim")) {
      // 最後の段落が中間結果の場合は内容を更新
      lastParagraph.textContent = text;
    } else {
      // 新しい中間結果を作成
      lastParagraph = document.createElement("p");
      lastParagraph.textContent = text;
      lastParagraph.classList.add("interim");
      chatContainer.appendChild(lastParagraph);
    }
  } else {
    // 最終結果が来た場合、新しい段落として追加し、以前の中間結果をクリア
    const finalMessage = document.createElement("p");
    finalMessage.textContent = text;
    chatContainer.appendChild(finalMessage);

    // すべての中間結果をクリア
    Array.from(chatContainer.getElementsByClassName("interim")).forEach((el) =>
      el.remove()
    );
  }

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function bookmarkText() {
  const chatContainer = document.getElementById("chatContainer");
  const text = chatContainer.innerText.trim(); // 先頭と末尾の空白を削除
  const bookmarkIcon = document.getElementById("bookmarkIcon");

  const index = bookmarks.indexOf(text);
  if (index === -1) {
    // ブックマークが存在しない場合、追加
    bookmarks.push(text);
    bookmarkIcon.classList.remove("bi-bookmark");
    bookmarkIcon.classList.add("bi-bookmark-fill");
  } else {
    // 既にブックマークされている場合、削除
    bookmarks.splice(index, 1);
    bookmarkIcon.classList.remove("bi-bookmark-fill");
    bookmarkIcon.classList.add("bi-bookmark");
  }
  saveBookmarksToStorage(); // ブックマークを保存
  updateBookmarks(); // ブックマークの表示を更新
}

function updateBookmarks() {
  const bookmarksContainer = document.getElementById("bookmarks");
  bookmarksContainer.innerHTML = ""; // 既存のブックマークをクリア

  // カードとリストグループのコンテナを作成
  const card = document.createElement("div");
  card.className = "card border-0"; // 複数のクラスをスペースで区切って指定

  const listGroup = document.createElement("ol");
  listGroup.className = "list-group list-group-flush";

  bookmarks.forEach((bookmark, index) => {
    // ブックマークテキストのリストアイテムを生成
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.textContent = bookmark;

    // 削除アイコンボタンをリストアイテムに追加
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-sm float-end";
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
    deleteButton.onclick = function () {
      removeBookmark(index);
      updateBookmarks(); // 更新後にブックマークリストを再描画
    };
    listItem.appendChild(deleteButton);

    listGroup.appendChild(listItem);
  });

  card.appendChild(listGroup);
  bookmarksContainer.appendChild(card);
}

function removeBookmark(index) {
  bookmarks.splice(index, 1); // 指定されたインデックスのブックマークを削除
  saveBookmarksToStorage(); // 更新したブックマークリストを保存
  updateBookmarks(); // ブックマークリストを再描画
}

let bookmarks = []; // ブックマークされたテキストを保存する配列

function saveBookmarksToStorage() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

document.addEventListener("DOMContentLoaded", function () {
  const storedBookmarks = localStorage.getItem("bookmarks");
  if (storedBookmarks) {
    bookmarks = JSON.parse(storedBookmarks);
    updateBookmarks();
    const chatContainer = document.getElementById("chatContainer");
    const text = chatContainer.innerText;
    const bookmarkIcon = document.getElementById("bookmarkIcon");
    if (bookmarks.includes(text)) {
      bookmarkIcon.classList.remove("bi-bookmark");
      bookmarkIcon.classList.add("bi-bookmark-fill");
    } else {
      bookmarkIcon.classList.remove("bi-bookmark-fill");
      bookmarkIcon.classList.add("bi-bookmark");
    }
  }
  updateMicrophoneButton();
});

function bookmarkText() {
  const chatContainer = document.getElementById("chatContainer");
  const text = chatContainer.innerText;
  if (text && !bookmarks.includes(text)) {
    bookmarks.push(text);
    saveBookmarksToStorage();
    updateBookmarks();
    updateBookmarkIcon(); // アイコンの状態を更新
  }
}

function removeBookmark(index) {
  bookmarks.splice(index, 1);
  saveBookmarksToStorage();
  updateBookmarks();
  updateBookmarkIcon(); // アイコンの状態を更新
}

document.addEventListener("DOMContentLoaded", function () {
  const storedBookmarks = localStorage.getItem("bookmarks");
  if (storedBookmarks) {
    bookmarks = JSON.parse(storedBookmarks);
    updateBookmarks();
  }
  updateMicrophoneButton();
  updateBookmarkIcon(); // 初期読み込み時にアイコンの状態を設定
});
