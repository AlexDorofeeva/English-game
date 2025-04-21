// import { arrEng, arrRus } from "./../data/arrays.js";

const header = document.querySelector(".header");
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const svgMoon = document.querySelector(".svg-moon");
const svgSun = document.querySelector(".svg-sun");
const startButton = document.getElementById("start-btn");
const checkButton = document.getElementById("check-btn");
const input = document.getElementById("input");
const resetButton = document.querySelector(".reset-btn");
const sentenceField = document.querySelector(".task-sentence");
const wordsField = document.querySelector(".words-field");
const result = document.querySelector(".result");

const themeChangerInput = document.querySelector("#theme-changer-input");
const themeChangerLabel = document.querySelector(".theme-changer-label");

let current = 0;

const url = "./data/sentences.json";
const arrEng = [];
const arrRus = [];
const arrChi = [];
let shuffled = [];

async function fetchSentencesJSON() {
  const response = await fetch(url);
  const sentences = await response.json();
  return sentences;
}

fetchSentencesJSON().then((data) => {
  for (let i = 0; i < data.length; i++) {
    arrEng[i] = data[i]["eng"];
    arrRus[i] = data[i]["rus"];
    arrChi[i] = data[i]["chi"];
  }
});
const switcher = document.getElementById("language-switcher");

function updateLanguageContent(language) {
  const mainTask = document.querySelector(".main-task");
  const taskSentence = document.querySelector(".task-sentence");
  const subTask = document.querySelector(".sub-task");
  const input1 = document.querySelector("#input");

  if (language === "eng") {
    mainTask.innerHTML = "Translate the sentence";
    taskSentence.innerHTML = "Press 'start' to begin the game";
    subTask.innerHTML =
      "Form a sentence from the given words, taking into account capital letters and punctuation marks.";
    input1.placeholder = "Enter text...";
    console.log("English selected");
  } else if (language === "rus") {
    mainTask.innerHTML = "Переведите предложение";
    taskSentence.innerHTML = "Нажмите Start, чтобы начать игру";
    subTask.innerHTML =
      " Из данных слов составьте предложение с учетом прописных букв и знаков препинания.";
    input1.placeholder = "Введите текст...";
    console.log("Russian selected");
  } else if (language === "chi") {
    mainTask.innerHTML = "翻译一句话";
    taskSentence.innerHTML = "点击“开始”按钮以开始游戏";
    subTask.innerHTML = "从给定的单词中组成句子，注意大写字母和标点符号。";
    input1.placeholder = "输入文本...";
    console.log("Chinese selected");
  }
}

switcher.addEventListener("change", () => {
  const selectedLanguage = switcher.value;
  localStorage.setItem("selectedLanguage", selectedLanguage);
  updateLanguageContent(selectedLanguage);
});

window.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("selectedLanguage");
  if (savedLanguage) {
    switcher.value = savedLanguage; // Set the dropdown to the saved language
    updateLanguageContent(savedLanguage);
  }
});

//put switcher into a function and the call her, how to do it? - done!
//  optimise the code to min, by switchers or by language?- done!
//local storage ????

// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     for (let i = 0; i < data.length; i++) {
//       arrEng[i] = data[i]['eng'];
//       arrRus[i] = data[i]['rus'];
//     }
//   });

function initTheme() {
  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") === "dark") {
      darkTheme();
    } else {
      lightTheme();
    }
  }
}

initTheme();

themeChangerInput.addEventListener("click", () => {
  if (themeChangerInput.checked) {
    darkTheme();
    localStorage.setItem("theme", "dark");
  } else {
    lightTheme();
    localStorage.setItem("theme", "light");
  }
  resultFieldBackground();
});

// function changeTheme(themeChangerInput) {
//   svgMoon.classList.toggle("svg-none-display");
//   header.classList.toggle("dark-theme");
//   main.classList.toggle("dark-theme");
//   footer.classList.toggle("dark-theme");
//   svgSun.classList.toggle("svg-none-display");
//   resultFieldBackground();
// }

function darkTheme() {
  themeChangerInput.checked = true;
  svgSun.classList.remove("svg-none-display");
  svgMoon.classList.add("svg-none-display");
  header.classList.add("dark-theme");
  main.classList.add("dark-theme");
  footer.classList.add("dark-theme");
}

function lightTheme() {
  themeChangerInput.checked = false;
  svgSun.classList.add("svg-none-display");
  svgMoon.classList.remove("svg-none-display");
  header.classList.remove("dark-theme");
  footer.classList.remove("dark-theme");
  main.classList.remove("dark-theme");
}

input.addEventListener("input", () => {
  if (input.value.length !== 0) {
    checkButton.classList.remove("disabled");
    resetButton.style.display = "block";
  } else {
    initState();
  }
});

resetButton.addEventListener("click", () => {
  initState();
});

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    // event.preventDefault();
    checkButton.click();
  }
});

function initState() {
  input.value = "";
  result.innerHTML = "";
  checkButton.classList.add("disabled");
  resetButton.style.display = "none";
  result.style.background = "transparent";

  document.querySelectorAll(".word").forEach((e) => {
    e.classList.remove("disabled");
  });
}

startButton.addEventListener("click", function (event) {
  initState();
  wordsField.innerHTML = "";

  current = Math.floor(Math.random() * arrEng.length);
  sentenceField.innerHTML = arrRus[current];
  if (switcher.value == "chi") {
    sentenceField.innerHTML = arrChi[current];
  }

  shuffled = arrEng[current]
    .replace(/[\W_]+/g, " ")
    .trim()
    .split(" ")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .concat(
      arrEng[current]
        .replace(/[\w\s]+/g, "")
        .trim()
        .split("")
    );

  shuffled.forEach((el, i) => {
    let item = document.createElement("p");
    item.setAttribute("id", i);
    item.classList.add("word");
    item.innerHTML = el.toLowerCase();

    wordsField.appendChild(item);
  });

  input.classList.remove("disabled");
  input.focus();
});

checkButton.addEventListener("click", () => {
  if (input.value === arrEng[current]) {
    result.style.color = "green";
    if (switcher.value == "chi") {
      result.innerHTML = `你很棒！)`;
    }
    if (switcher.value == "rus") {
      result.innerHTML = `Поздравляем с правильным ответом!)`;
    }
  } else {
    result.style.color = "red";

    if (switcher.value == "chi") {
      result.innerHTML = `你写了 <span>${input.value}</span>. 请改一下.`;
    }
    if (switcher.value == "rus") {
      result.innerHTML = `Вы ввели: <span>${input.value}</span>. Скорректируйте свой ответ.`;
    }
  }
  resultFieldBackground();
});

function resultFieldBackground() {
  if (main.classList.contains("dark-theme") && input.value) {
    result.style.background = "#cdf2f5";
  } else {
    result.style.background = "transparent";
  }
}

document.addEventListener("click", (event) => {
  let target = event.target.closest(".word");

  if (target) {
    if (input.value.length === 0 || shuffled[target.id].match(/[\W]/)) {
      input.value += shuffled[target.id];
    } else {
      input.value += " " + shuffled[target.id];
    }
  }

  if (input.value && target) {
    target.classList.add("disabled");
    checkButton.classList.remove("disabled");
    resetButton.style.display = "block";
  }
});

// Copyright

document
  .getElementById("year")
  .appendChild(document.createTextNode(new Date().getFullYear()));
