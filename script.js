// ========== localStorage... ==========
if (!localStorage.getItem("value")) localStorage.setItem("value", 1);
let dataStorage = localStorage.getItem("value");

// console.log(dataStorage);

function conditionalFunc(localStorage1) {
  return localStorage1 ? dataStorage : 1;
}

// ========== localStorage. ==========

// ========== headerDom... ==========
// var formattedNumber = dataStorage;
var formattedNumber = ("0" + dataStorage).slice(-2);
// console.log(formattedNumber);

let headerDom = () => {
  let storageNum = conditionalFunc(dataStorage);
  // console.log(storageNum);

  let newDate_getTime_ = new Date().getTime();
  // console.log(newDate_getTime_);
  //1687200961827

  document.querySelector("header").innerHTML = /*html */ `<!--  -->
<div class="title">
    <h2 class="chapter"><span>${dataStorage}</span></h2>
</div>
<audio id="bible">
  <source src="assets/audio.mp3" type="audio/mpeg" />
</audio>
`;
};
headerDom();
// ========== headerDom. ==========

// ========== create select... ==========
var selectOptions = document.createElement("select");
document.body.appendChild(selectOptions);
for (var i = 1; i < numChapters + 1; i++) {
  var option = document.createElement("option");
  option.value = [i];
  option.text = [i];
  selectOptions.appendChild(option);
}
let select123 = document.querySelector("select");
select123[dataStorage - 1].selected = true;
// ========== create select. ==========

let func1 = () => {
  readTxt(selectOptions.value);
  localStorage.setItem("value", selectOptions.value);
  location.reload();
};
selectOptions.addEventListener("change", func1);

// ========== readTxt... ==========
const readTxt = async (numRead = 1) => {
  // console.log("fetch......" + numRead);
  // location.reload()

  //  fetch_en... ==========
  let url_en = `assets/text_01_en.txt`;
  let response_en = await fetch(url_en);
  const txt_en = await response_en.text().then((str) => {
    return str.split("\r"); // return the string after splitting it.
  });
  let result_en = txt_en;

  var number1 = 1;

  let main_en = document.querySelector(".main_en");
  for (i = 0; i <= result_en.length - 1; i++) {
    // console.log(result_en[i].length)
    // if (result_en[i].length <= 5) {
    if (result_en[i].length <= number1) {
      main_en.innerHTML += "<br>";
    } else {
      // main_en.innerHTML = main_en.innerHTML + "<p>" + result_en[i] + "</p>";
      main_en.innerHTML += "<p>" + result_en[i] + "</p>";
    }
  }

  //  fetch_en. ==========

  //  fetch_es... ==========
  let url_es = `assets/text_01_es.txt`;
  let response_es = await fetch(url_es);
  const txt_es = await response_es.text().then((str) => {
    return str.split("\r"); // return the string after splitting it.
  });

  let result_es = txt_es;

  let main_es = document.querySelector(".main_es");
  for (i = 0; i <= result_es.length - 1; i++) {
    // console.log(result_es[i].length)
    // if (result_es[i].length <= 5) {
    if (result_es[i].length <= number1) {
      main_es.innerHTML += "";
    } else {
      // main_es.innerHTML = main_es.innerHTML + "<p>" + result_es[i] + "</p>";
      main_es.innerHTML += "<p>" + result_es[i] + "</p>";
    }
  }
  //  fetch_es. ==========

  //  shortcut center... ==========
  let p_en = document.querySelectorAll(".main_en p");
  let p_es = document.querySelectorAll(".main_es p");

  p_en[0].classList.add("p");
  p_es[0].classList.add("p");

  //   const body = document.body;
  var num = 0;

  document.body.addEventListener("keydown", shortcut1);
  function shortcut1(e) {
    if (e.key == "ArrowUp") {
      p_en.forEach((element) => {
        element.classList.remove("p");
      });
      p_es.forEach((element) => {
        element.classList.remove("p");
      });
      num--;
      e.preventDefault();
    } else if (e.key == "ArrowDown") {
      p_en.forEach((element) => {
        element.classList.remove("p");
      });
      p_es.forEach((element) => {
        element.classList.remove("p");
      });
      num++;
      e.preventDefault();
    } else {
      return;
    }

    p_en[num].classList.add("p");
    p_en[num].scrollIntoView({ block: "center" });
    p_es[num].classList.add("p");
    p_es[num].scrollIntoView({ block: "center" });
    document.querySelector("footer").innerHTML = /*html */ `<!--  -->
<span>${num} / ${p_en.length - 1}</span>
`;
  }
  //  shortcut center. ==========
};

// readTxt();
// ========== readTxt. ==========
readTxt(dataStorage);

// ========== shortcut2... ==========
let audioBible = document.querySelector("#bible");

document.body.addEventListener("keydown", shortcut2);
function shortcut2(e) {
  if (e.code == "Space" || e.code == "ArrowRight") {
    e.preventDefault();
    audioBible.play();
  } else if (e.key == "Enter" || e.code == "Escape") {
    e.preventDefault();
    audioBible.pause();
  } else if (e.key == "Home" || e.code == "ArrowLeft") {
    e.preventDefault();
    audioBible.pause();
    audioBible.currentTime = 0;

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  } else if (e.key == 0) {
    location.reload();
  }
}

// ========== test key...
document.body.addEventListener("keydown", (event) => {
  // console.log(event.key + "     <= event.key");
  // console.log(event.code + "      <= event.code");
  // console.log(event.keyCode + "     <= event.keyCode");
  // console.log(event.which + "     <= event.which");
});
// ========== test key...

// ========== shortcut2. ==========

// ========== barProgress... ==========
var timer;
var percent = 0;
// var audioBible = document.getElementById("audioBible");
audioBible.addEventListener("playing", function (_event) {
  var duration = _event.target.duration;
  advance(duration, audioBible);
});
audioBible.addEventListener("pause", function (_event) {
  clearTimeout(timer);
});
var advance = function (duration, element) {
  var progress = document.getElementById("progress");
  increment = 10 / duration;
  percent = Math.min(increment * element.currentTime * 10, 100);
  progress.style.width = percent + "%";
  startTimer(duration, element);
};
var startTimer = function (duration, element) {
  if (percent < 100) {
    timer = setTimeout(function () {
      advance(duration, element);
    }, 100);
  }
};
// ========== barProgress. ==========

//   ========== time update... ==========
let currentTimeDOM = document.querySelector(".currentTimeDOM");
let durationDOM = document.querySelector(".durationDOM");

// === timeupdate
let convertTime = (time) => {
  let min = parseInt(time / 60);
  let sec = time % 60;
  return min + ":" + sec;
};

audioBible.addEventListener(
  "timeupdate",
  () => {
    const currentTime = Math.floor(audioBible.currentTime);
    const duration = Math.floor(audioBible.duration);
    currentTimeDOM.innerHTML = convertTime(currentTime);
    durationDOM.innerHTML = convertTime(duration);
  },
  false
);
//   ========== time update. ==========
