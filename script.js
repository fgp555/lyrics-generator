// ========== audio player ==========
const audioPlayer = document.querySelector("#audio_player");

audioPlayer.innerHTML = `
  <audio id="audioID">
    <source src="assets/audio.mp3" type="audio/mpeg" />
  </audio>
`;

const audio = document.getElementById("audioID");

// ========== render helper ==========
const renderText = (container, lines, breakOnEmpty = true) => {
  const frag = document.createDocumentFragment();

  lines.forEach((line) => {
    if (line.trim().length <= 1) {
      if (breakOnEmpty) {
        frag.appendChild(document.createElement("br"));
      }
      return;
    }

    const p = document.createElement("p");
    p.textContent = line;

    frag.appendChild(p);
  });

  container.innerHTML = "";
  container.appendChild(frag);
};

// ========== navigation ==========
let currentIndex = 0;
let p_en = [];
let p_es = [];

const updateUI = () => {
  p_en.forEach((el) => el.classList.remove("p"));
  p_es.forEach((el) => el.classList.remove("p"));

  currentIndex = Math.max(0, Math.min(currentIndex, p_en.length - 1));

  [p_en[currentIndex], p_es[currentIndex]].forEach((el) => {
    if (!el) return;

    el.classList.add("p");
    el.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  });
};

const setupNavigation = () => {
  p_en = [...document.querySelectorAll(".text_en p")];
  p_es = [...document.querySelectorAll(".text_es p")];

  if (!p_en.length || !p_es.length) return;

  updateUI();
};

// ========== load text ==========
const readTxt = async () => {
  try {
    const [enRes, esRes] = await Promise.all([fetch("assets/text_en.txt"), fetch("assets/text_es.txt")]);

    const [enText, esText] = await Promise.all([enRes.text(), esRes.text()]);

    const lines_en = enText.split(/\r?\n/);
    const lines_es = esText.split(/\r?\n/);

    const text_en = document.querySelector(".text_en");
    const text_es = document.querySelector(".text_es");

    renderText(text_en, lines_en, true);
    renderText(text_es, lines_es, false);

    setupNavigation();
  } catch (error) {
    console.error("Error loading text files:", error);
  }
};

readTxt();

// ========== keyboard controls ==========
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    // navigation
    case "ArrowUp":
      currentIndex--;
      updateUI();
      e.preventDefault();
      break;

    case "ArrowDown":
      currentIndex++;
      updateUI();
      e.preventDefault();
      break;

    // audio play
    case " ":
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }

      e.preventDefault();
      break;
      
    case "ArrowRight":
      audio.play();
      e.preventDefault();
      break;

    // audio pause
    case "Enter":
    case "Escape":
      audio.pause();
      e.preventDefault();
      break;

    // restart
    case "Home":
    case "ArrowLeft":
      audio.pause();
      audio.currentTime = 0;
      currentIndex = 0;
      updateUI();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      e.preventDefault();
      break;
  }
});

// ========== progress bar ==========
const progress_bar = document.getElementById("progress_bar");

let timer = null;

const updateProgress = () => {
  if (!audio.duration) return;

  const percent = Math.min((audio.currentTime / audio.duration) * 100, 100);

  progress_bar.style.width = `${percent}%`;

  timer = setTimeout(updateProgress, 100);
};

audio.addEventListener("playing", () => {
  clearTimeout(timer);
  updateProgress();
});

audio.addEventListener("pause", () => {
  clearTimeout(timer);
});

audio.addEventListener("ended", () => {
  clearTimeout(timer);
  progress_bar.style.width = "100%";
});
