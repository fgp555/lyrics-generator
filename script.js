let book = "John";
let chapter = "Chapter";
let version = "English Standard Version";
let numChapters = 21;

// ========== storage ==========
const STORAGE_KEY = "value";
const dataStorage = Number(localStorage.getItem(STORAGE_KEY)) || 1;
localStorage.setItem(STORAGE_KEY, dataStorage);

// ========== header ==========
const audioPlayer = () => {
  document.querySelector("#audio-player").innerHTML = `
    <div class="title">
      <h2 class="chapter"><span>${dataStorage}</span></h2>
    </div>
    <audio id="bible">
      <source src="assets/audio.mp3" type="audio/mpeg" />
    </audio>
  `;
};
audioPlayer();

// ========== select ==========
const select = document.createElement("select");
document.body.appendChild(select);

// Fill select options
for (let i = 1; i <= numChapters; i++) {
  const option = new Option(i, i);
  select.appendChild(option);
}
select.value = dataStorage;

// On change update storage (no reload needed)
select.addEventListener("change", () => {
  localStorage.setItem(STORAGE_KEY, select.value);
  readTxt(select.value);
});

// ========== render helper ==========
const renderText = (container, lines, breakOnEmpty = true) => {
  const frag = document.createDocumentFragment();

  lines.forEach((line) => {
    if (line.trim().length <= 1) {
      if (breakOnEmpty) frag.appendChild(document.createElement("br"));
      return;
    }
    const p = document.createElement("p");
    p.textContent = line;
    frag.appendChild(p);
  });

  container.innerHTML = "";
  container.appendChild(frag);
};

// ========== main logic ==========
const readTxt = async () => {
  const [enRes, esRes] = await Promise.all([fetch("assets/text-en.txt"), fetch("assets/text-es.txt")]);

  const [enText, esText] = await Promise.all([enRes.text(), esRes.text()]);

  const lines_en = enText.split("\r");
  const lines_es = esText.split("\r");

  const main_en = document.querySelector(".main_en");
  const main_es = document.querySelector(".main_es");

  renderText(main_en, lines_en, true);
  renderText(main_es, lines_es, false);

  setupNavigation();
};

readTxt();

// ========== navigation ==========
let currentIndex = 0;

const setupNavigation = () => {
  const p_en = document.querySelectorAll(".main_en p");
  const p_es = document.querySelectorAll(".main_es p");

  if (!p_en.length || !p_es.length) return;

  const updateUI = () => {
    p_en.forEach((el) => el.classList.remove("p"));
    p_es.forEach((el) => el.classList.remove("p"));

    currentIndex = Math.max(0, Math.min(currentIndex, p_en.length - 1));

    p_en[currentIndex].classList.add("p");
    p_es[currentIndex].classList.add("p");

    p_en[currentIndex].scrollIntoView({ block: "center" });
    p_es[currentIndex].scrollIntoView({ block: "center" });

    document.querySelector("footer").innerHTML = `
      <span>${currentIndex} / ${p_en.length - 1}</span>
    `;
  };

  updateUI();

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      currentIndex--;
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      currentIndex++;
      e.preventDefault();
    } else {
      return;
    }
    updateUI();
  });
};

// ========== audio controls ==========
const audio = document.querySelector("#bible");

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowRight") {
    e.preventDefault();
    audio.play();
  } else if (e.key === "Enter" || e.code === "Escape") {
    e.preventDefault();
    audio.pause();
  } else if (e.key === "Home" || e.code === "ArrowLeft") {
    e.preventDefault();
    audio.pause();
    audio.currentTime = 0;
    window.scrollTo(0, 0);
  }
});

// ========== progress bar ==========
let timer;

const updateProgress = (duration, el) => {
  const progress = document.getElementById("progress");
  const percent = Math.min((el.currentTime / duration) * 100, 100);
  progress.style.width = percent + "%";

  timer = setTimeout(() => updateProgress(duration, el), 100);
};

audio.addEventListener("playing", (e) => {
  clearTimeout(timer);
  updateProgress(e.target.duration, audio);
});

audio.addEventListener("pause", () => clearTimeout(timer));

// ========== time display ==========
const currentTimeDOM = document.querySelector(".currentTimeDOM");
const durationDOM = document.querySelector(".durationDOM");

const formatTime = (t) => {
  const min = Math.floor(t / 60);
  const sec = String(t % 60).padStart(2, "0");
  return `${min}:${sec}`;
};

audio.addEventListener("timeupdate", () => {
  currentTimeDOM.textContent = formatTime(Math.floor(audio.currentTime));
  durationDOM.textContent = formatTime(Math.floor(audio.duration || 0));
});
