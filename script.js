const PUZZLE_GROUPS = [
  {
    id: "tri-sukses",
    title: "Tri Sukses Generus",
    description: "Fondasi generasi berakhlak, berilmu, dan mandiri.",
    items: [
      "Berakhlak Mulia (Akhlaqul Karimah)",
      "Berilmu (Alim Faqih)",
      "Mandiri"
    ]
  },
  {
    id: "thabiat-luhur",
    title: "6 Thabiat Luhur",
    description: "Sikap dasar harian untuk hidup rukun dan dapat dipercaya.",
    items: [
      "Rukun",
      "Kompak",
      "Kerja Sama yang Baik",
      "Jujur",
      "Amanah",
      "Mujhid-Muzhid"
    ]
  },
  {
    id: "tali-keimanan",
    title: "4 Tali Keimanan",
    description: "Penguat hubungan hati dengan Allah dalam keseharian.",
    items: [
      "Bersyukur",
      "Mempersungguh",
      "Mengagungkan",
      "Berdoa"
    ]
  },
  {
    id: "prinsip-kerja",
    title: "3 Prinsip Kerja",
    description: "Patokan bekerja dengan benar, efektif, dan berkomitmen.",
    items: [
      "Benar",
      "Kurup",
      "Janji"
    ]
  },
  {
    id: "maqodirulloh",
    title: "4 Maqodirulloh",
    description: "Sikap saat menerima nikmat, ujian, dan kesalahan diri.",
    items: [
      "Syukur atas nikmat",
      "Istirja' saat musibah",
      "Sabar dalam cobaan",
      "Bertaubat atas kesalahan"
    ]
  },
  {
    id: "roda-kehidupan",
    title: "4 Roda Kehidupan",
    description: "Peduli sesama dalam dinamika hidup dan pembinaan bersama.",
    items: [
      "Yang kuat membantu yang lemah",
      "Yang bisa membantu yang belum bisa",
      "Yang ingat mengingatkan yang lupa",
      "Yang salah dinasihati untuk bertaubat"
    ]
  },
  {
    id: "rukun-kompak",
    title: "5 Syarat Rukun dan Kompak",
    description: "Bekal menjaga relasi yang sehat, aman, dan harmonis.",
    items: [
      "Bicara baik dan benar",
      "Jujur dan saling percaya",
      "Sabar dan mengalah",
      "Tidak menyakiti/merusak sesama",
      "Saling memperhatikan dan menjaga perasaan"
    ]
  }
];

const totalItems = PUZZLE_GROUPS.reduce((sum, group) => sum + group.items.length, 0);
// Isi endpoint ini jika ingin nomor urutan bertambah global untuk semua user di GitHub Pages.
const THR_COUNTER_ENDPOINT = "https://script.google.com/macros/s/AKfycbzsuqmnMThpn0Z-XGmnqlxPbwg9BURpD9FD9OHx-XSvjZH3dVdaoBB12cQnPB_HN8xB/exec";
const LOCAL_COUNTER_KEY = "ucapanlebaran2026_thr_counter_local";

const puzzleItems = PUZZLE_GROUPS.flatMap((group) =>
  group.items.map((label, index) => ({
    id: `${group.id}-${index}`,
    label,
    categoryId: group.id
  }))
);

const groupMap = new Map(PUZZLE_GROUPS.map((group) => [group.id, group]));
const itemMap = new Map(puzzleItems.map((item) => [item.id, item]));

const body = document.body;
const intro = document.getElementById("introGame");
const openButton = document.getElementById("openGreeting");
const resetButton = document.getElementById("resetPuzzle");
const chipBank = document.getElementById("chipBank");
const categoryBoard = document.getElementById("categoryBoard");
const progressPill = document.getElementById("progressPill");
const progressFill = document.getElementById("progressFill");
const timerPill = document.getElementById("timerPill");
const statusText = document.getElementById("puzzleStatus");
const actionBar = document.getElementById("actionBar");
const actionBadge = document.getElementById("actionBadge");
const actionEyebrow = document.getElementById("actionEyebrow");
const actionTitle = document.getElementById("actionTitle");
const actionText = document.getElementById("actionText");
const audioButton = document.getElementById("audioToggle");
const audio = document.getElementById("takbiranAudio");
const scene = document.getElementById("celebrationScene");
const thrButton = document.getElementById("thrButton");
const puzzleDurationText = document.getElementById("puzzleDurationText");
const puzzleDurationNote = document.getElementById("puzzleDurationNote");
const thrRankText = document.getElementById("thrRankText");
const thrRankNote = document.getElementById("thrRankNote");
const feedbackModal = document.getElementById("feedbackModal");
const modalCloseButton = document.getElementById("modalClose");
const modalDismissButton = document.getElementById("modalDismiss");
const modalActionButton = document.getElementById("modalAction");
const modalBadge = document.getElementById("modalBadge");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalMetaOneLabel = document.getElementById("modalMetaOneLabel");
const modalMetaOneValue = document.getElementById("modalMetaOneValue");
const modalMetaTwoLabel = document.getElementById("modalMetaTwoLabel");
const modalMetaTwoValue = document.getElementById("modalMetaTwoValue");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let shuffledItemIds = [];
let placedItemIds = new Set();
let selectedItemId = null;
let draggedItemId = null;
let fireworksInstance = null;
let greetingOpened = false;
let puzzleCompleted = false;
let lastGuidedCategoryId = null;
let lastActionTone = "info";
let lastActionNote = "Tombol ini masih abu-abu sampai semua 29 poin masuk ke tema yang tepat.";
let puzzleStartedAt = 0;
let completedDurationMs = 0;
let timerIntervalId = null;
let thrCounterLoading = false;

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function formatClock(totalMs) {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDurationLong(totalMs) {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} detik`;
  }

  return `${minutes} menit ${seconds} detik`;
}

function updateTimerDisplays() {
  const activeDuration = puzzleCompleted
    ? completedDurationMs
    : puzzleStartedAt
      ? Date.now() - puzzleStartedAt
      : 0;

  timerPill.textContent = formatClock(activeDuration);
  puzzleDurationText.textContent = formatClock(activeDuration);

  if (puzzleCompleted) {
    puzzleDurationNote.textContent = `Anda menyusun puzzle dalam ${formatDurationLong(activeDuration)}.`;
    return;
  }

  puzzleDurationNote.textContent = "Timer berjalan sejak puzzle diacak ulang.";
}

function startPuzzleTimer() {
  if (timerIntervalId) {
    window.clearInterval(timerIntervalId);
  }

  puzzleStartedAt = Date.now();
  completedDurationMs = 0;
  updateTimerDisplays();
  timerIntervalId = window.setInterval(updateTimerDisplays, 1000);
}

function stopPuzzleTimer() {
  if (timerIntervalId) {
    window.clearInterval(timerIntervalId);
    timerIntervalId = null;
  }

  completedDurationMs = puzzleStartedAt ? Date.now() - puzzleStartedAt : 0;
  updateTimerDisplays();
}

function getProgress() {
  return placedItemIds.size;
}

function getUnplacedItems() {
  return shuffledItemIds
    .filter((itemId) => !placedItemIds.has(itemId))
    .map((itemId) => itemMap.get(itemId));
}

function getPlacedItemsForGroup(groupId) {
  const group = groupMap.get(groupId);

  return group.items
    .map((label) => puzzleItems.find((item) => item.categoryId === groupId && item.label === label))
    .filter((item) => placedItemIds.has(item.id));
}

function showStatus(message, tone = "info") {
  statusText.textContent = message;

  if (tone === "info") {
    delete statusText.dataset.tone;
    return;
  }

  statusText.dataset.tone = tone;
}

function updateActionBar() {
  const progress = getProgress();
  const remaining = totalItems - progress;

  actionBadge.textContent = puzzleCompleted ? "29" : String(progress);

  if (puzzleCompleted) {
    actionBar.classList.add("is-ready");
    actionEyebrow.textContent = "Tombol aktif";
    actionTitle.textContent = "Semua 29 karakter sudah pas";
    actionText.textContent = "Lanjut ke halaman ucapan, lalu tombol Ambil THR bisa langsung dipakai.";
    openButton.textContent = "Ambil THR di Halaman Berikutnya";
    openButton.disabled = false;
    openButton.setAttribute("aria-disabled", "false");
    openButton.classList.remove("is-disabled");
    return;
  }

  actionBar.classList.remove("is-ready");
  actionEyebrow.textContent = lastActionTone === "error" ? "Petunjuk terakhir" : "Tombol belum aktif";
  actionTitle.textContent =
    lastActionTone === "error"
      ? "Masih ada poin yang kurang pas"
      : progress === 0
        ? "Susun semua 29 karakter dulu"
        : `${progress} poin sudah pas, ${remaining} lagi`;
  actionText.textContent = lastActionNote;
  openButton.textContent = "Selesaikan Puzzle untuk Lanjut";
  openButton.disabled = true;
  openButton.setAttribute("aria-disabled", "true");
  openButton.classList.add("is-disabled");
}

function updateThrInfo(text, note) {
  thrRankText.textContent = text;
  thrRankNote.textContent = note;
}

function clearGuidedZone() {
  if (!lastGuidedCategoryId) {
    return;
  }

  const previousZone = categoryBoard.querySelector(`[data-category-id="${lastGuidedCategoryId}"]`);
  previousZone?.classList.remove("is-guided");
  lastGuidedCategoryId = null;
}

function guideCorrectZone(categoryId) {
  clearGuidedZone();

  const zone = categoryBoard.querySelector(`[data-category-id="${categoryId}"]`);

  if (!zone) {
    return;
  }

  lastGuidedCategoryId = categoryId;
  zone.classList.add("is-guided");

  if (!reducedMotion.matches) {
    zone.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  window.setTimeout(() => {
    if (lastGuidedCategoryId !== categoryId) {
      return;
    }

    zone.classList.remove("is-guided");
    lastGuidedCategoryId = null;
  }, 2600);
}

function openFeedbackModal(config) {
  feedbackModal.hidden = false;
  feedbackModal.classList.toggle("is-success", config.mode === "success");
  body.classList.add("is-modal-open");

  modalBadge.textContent = config.badge;
  modalEyebrow.textContent = config.eyebrow;
  modalTitle.textContent = config.title;
  modalMessage.textContent = config.message;
  modalMetaOneLabel.textContent = config.metaOneLabel;
  modalMetaOneValue.textContent = config.metaOneValue;
  modalMetaTwoLabel.textContent = config.metaTwoLabel;
  modalMetaTwoValue.textContent = config.metaTwoValue;
  modalDismissButton.textContent = config.dismissText;
  modalActionButton.hidden = !config.showAction;
  modalActionButton.disabled = !config.showAction;
  modalActionButton.setAttribute("aria-disabled", String(!config.showAction));
  modalActionButton.classList.toggle("is-disabled", !config.showAction);

  if (config.showAction) {
    modalActionButton.textContent = config.actionText;
  }

  const focusTarget = config.showAction ? modalActionButton : modalDismissButton;
  window.setTimeout(() => focusTarget.focus(), 0);
}

function closeFeedbackModal() {
  feedbackModal.hidden = true;
  feedbackModal.classList.remove("is-success");
  body.classList.remove("is-modal-open");
  modalActionButton.hidden = true;
  modalActionButton.disabled = true;
  modalActionButton.setAttribute("aria-disabled", "true");
  modalActionButton.classList.add("is-disabled");
}

async function registerThrClaim() {
  if (thrCounterLoading) {
    return;
  }

  thrCounterLoading = true;
  updateThrInfo("Menghitung...", "Sedang mengambil nomor urutan penyusun puzzle.");

  try {
    if (THR_COUNTER_ENDPOINT) {
      const response = await fetch(THR_COUNTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          event: "thr_click",
          duration_seconds: Math.floor(completedDurationMs / 1000),
          completed_at: new Date().toISOString()
        })
      });

      const rawText = await response.text();
      const data = JSON.parse(rawText);

      if (!response.ok || typeof data.rank !== "number") {
        throw new Error("Counter endpoint tidak mengembalikan rank yang valid.");
      }

      updateThrInfo(
        `Penyusun puzzle ke-${data.rank}`,
        `Nomor ini dihitung global dari klik tombol Ambil THR. Durasi Anda: ${formatDurationLong(completedDurationMs)}.`
      );
      return;
    }

    const nextRank = Number(localStorage.getItem(LOCAL_COUNTER_KEY) || "0") + 1;
    localStorage.setItem(LOCAL_COUNTER_KEY, String(nextRank));
    updateThrInfo(
      `Penyusun puzzle ke-${nextRank}`,
      `Saat ini masih mode lokal browser. Untuk hitungan global semua user di GitHub Pages, isi endpoint API di script.js. Durasi Anda: ${formatDurationLong(completedDurationMs)}.`
    );
  } catch (error) {
    console.error("Gagal menghitung urutan THR.", error);
    updateThrInfo(
      "Urutan belum tersedia",
      "Counter global belum terhubung. Tambahkan endpoint API agar nomor urutan bisa bertambah untuk semua user."
    );
  } finally {
    thrCounterLoading = false;
  }
}

function updateProgress() {
  const progress = getProgress();
  const percentage = Math.round((progress / totalItems) * 100);

  progressPill.textContent = `${progress} / ${totalItems} selesai`;
  progressFill.style.width = `${percentage}%`;
}

function buildChip(item, extraClass = "") {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = `chip ${extraClass}`.trim();
  chip.textContent = item.label;
  chip.dataset.itemId = item.id;
  return chip;
}

function clearZoneHighlights() {
  categoryBoard.querySelectorAll(".category").forEach((zone) => {
    zone.classList.remove("is-active");
  });
}

function animateZone(categoryId, className) {
  const zone = categoryBoard.querySelector(`[data-category-id="${categoryId}"]`);

  if (!zone) {
    return;
  }

  zone.classList.add(className);

  window.setTimeout(() => {
    zone.classList.remove(className);
  }, 450);
}

function animateSelectedChip() {
  if (!selectedItemId) {
    return;
  }

  const chip = chipBank.querySelector(`[data-item-id="${selectedItemId}"]`);

  if (!chip) {
    return;
  }

  chip.classList.add("is-wrong");

  window.setTimeout(() => {
    chip.classList.remove("is-wrong");
  }, 450);
}

function renderChipBank() {
  chipBank.innerHTML = "";

  getUnplacedItems().forEach((item) => {
    const chip = buildChip(item, selectedItemId === item.id ? "is-selected" : "");
    chip.draggable = true;

    chip.addEventListener("click", () => {
      if (puzzleCompleted) {
        return;
      }

      selectedItemId = selectedItemId === item.id ? null : item.id;
      renderChipBank();
      showStatus(
        selectedItemId
          ? `Poin "${item.label}" dipilih. Sekarang ketuk tema yang menurut Anda tepat.`
          : "Pilihan dibatalkan. Pilih poin lain atau langsung drag ke tema tujuan."
      );
    });

    chip.addEventListener("dragstart", (event) => {
      draggedItemId = item.id;
      chip.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", item.id);
      showStatus(`Seret "${item.label}" ke tema yang sesuai.`);
    });

    chip.addEventListener("dragend", () => {
      draggedItemId = null;
      chip.classList.remove("is-dragging");
      clearZoneHighlights();
    });

    chipBank.appendChild(chip);
  });
}

function renderCategories() {
  categoryBoard.innerHTML = "";

  PUZZLE_GROUPS.forEach((group) => {
    const placedItems = getPlacedItemsForGroup(group.id);
    const category = document.createElement("article");
    category.className = "category";
    category.dataset.categoryId = group.id;
    category.tabIndex = 0;

    if (placedItems.length === group.items.length) {
      category.classList.add("is-complete");
    }

    const header = document.createElement("div");
    header.className = "category__top";

    const title = document.createElement("h3");
    title.className = "category__title";
    title.textContent = group.title;

    const count = document.createElement("span");
    count.className = "category__count";
    count.textContent = `${placedItems.length}/${group.items.length}`;

    header.append(title, count);

    const description = document.createElement("p");
    description.className = "category__desc";
    description.textContent = group.description;

    const list = document.createElement("div");
    list.className = "category__list";

    placedItems.forEach((item) => {
      list.appendChild(buildChip(item, "chip--placed"));
    });

    const hint = document.createElement("p");
    hint.className = "category__hint";
    hint.textContent =
      placedItems.length === group.items.length
        ? "Tema ini sudah lengkap."
        : `Butuh ${group.items.length - placedItems.length} poin lagi.`;

    category.addEventListener("dragenter", (event) => {
      if (!draggedItemId) {
        return;
      }

      event.preventDefault();
      category.classList.add("is-active");
    });

    category.addEventListener("dragover", (event) => {
      if (!draggedItemId) {
        return;
      }

      event.preventDefault();
    });

    category.addEventListener("dragleave", () => {
      category.classList.remove("is-active");
    });

    category.addEventListener("drop", (event) => {
      const itemId = event.dataTransfer.getData("text/plain") || draggedItemId;

      event.preventDefault();
      category.classList.remove("is-active");

      if (!itemId) {
        return;
      }

      placeItem(itemId, group.id);
    });

    category.addEventListener("click", () => {
      if (!selectedItemId) {
        return;
      }

      placeItem(selectedItemId, group.id);
    });

    category.addEventListener("keydown", (event) => {
      if (!selectedItemId) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        placeItem(selectedItemId, group.id);
      }
    });

    category.append(header, description, list, hint);
    categoryBoard.appendChild(category);
  });
}

function checkCompletion() {
  if (puzzleCompleted || getProgress() !== totalItems) {
    return;
  }

  puzzleCompleted = true;
  stopPuzzleTimer();
  body.classList.add("puzzle-complete");
  lastActionTone = "success";
  lastActionNote = `Semua poin sudah tepat. Waktu Anda ${formatDurationLong(completedDurationMs)} dan tombol bawah sekarang aktif.`;
  showStatus("Puzzle selesai. Tombol untuk membuka halaman berikutnya sudah aktif.", "success");
  updateActionBar();
  openFeedbackModal({
    mode: "success",
    badge: "29",
    eyebrow: "Puzzle selesai",
    title: "Semua 29 karakter berhasil disusun",
    message: `Halaman ucapan siap dibuka. Anda menyusunnya dalam ${formatDurationLong(completedDurationMs)}.`,
    metaOneLabel: "Hasil",
    metaOneValue: `29 / 29 poin pas`,
    metaTwoLabel: "Aksi selanjutnya",
    metaTwoValue: "Buka halaman ucapan",
    dismissText: "Tetap di Puzzle",
    showAction: true,
    actionText: "Ambil THR di Halaman Berikutnya"
  });

  if (!reducedMotion.matches) {
    actionBar.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function placeItem(itemId, categoryId) {
  if (puzzleCompleted || placedItemIds.has(itemId)) {
    return;
  }

  const item = itemMap.get(itemId);

  if (!item) {
    return;
  }

  if (item.categoryId !== categoryId) {
    const wrongGroup = groupMap.get(categoryId);
    const correctGroup = groupMap.get(item.categoryId);
    const wrongMessage = `"${item.label}" kurang pas di "${wrongGroup.title}". Poin ini lebih cocok masuk ke "${correctGroup.title}".`;

    animateZone(categoryId, "is-wrong");
    animateSelectedChip();
    guideCorrectZone(correctGroup.id);
    lastActionTone = "error";
    lastActionNote = wrongMessage;
    showStatus(wrongMessage, "error");
    updateActionBar();
    openFeedbackModal({
      mode: "error",
      badge: "!",
      eyebrow: "Masih kurang pas",
      title: "Poin ini belum berada di tema yang tepat",
      message: `Coba pindahkan "${item.label}" ke kelompok yang lebih sesuai. Petunjuknya juga tetap tersimpan di panel bawah.`,
      metaOneLabel: "Kurang pas di",
      metaOneValue: wrongGroup.title,
      metaTwoLabel: "Lebih pas di",
      metaTwoValue: correctGroup.title,
      dismissText: "Lanjut Susun Puzzle",
      showAction: false,
      actionText: ""
    });
    return;
  }

  placedItemIds.add(itemId);
  selectedItemId = null;
  draggedItemId = null;
  clearGuidedZone();
  lastActionTone = "success";
  lastActionNote = `"${item.label}" sudah pas di "${groupMap.get(categoryId).title}".`;
  renderPuzzle();
  animateZone(categoryId, "is-correct");
  showStatus(`Benar. "${item.label}" masuk ke tema "${groupMap.get(categoryId).title}".`, "success");
  checkCompletion();
}

function renderPuzzle() {
  updateProgress();
  renderChipBank();
  renderCategories();
  updateActionBar();
}

function resetPuzzle() {
  shuffledItemIds = shuffleArray(puzzleItems.map((item) => item.id));
  placedItemIds = new Set();
  selectedItemId = null;
  draggedItemId = null;
  puzzleCompleted = false;
  clearGuidedZone();
  closeFeedbackModal();
  lastActionTone = "info";
  lastActionNote = "Tombol ini masih abu-abu sampai semua 29 poin masuk ke tema yang tepat.";
  body.classList.remove("puzzle-complete");
  updateThrInfo("Belum dihitung", "Nomor urutan muncul saat tombol Ambil THR ditekan.");
  startPuzzleTimer();
  renderPuzzle();
  showStatus("Poin diacak ulang. Susun kembali 29 Karakter Luhur dari awal.");
}

function getFireworksClass() {
  if (window.Fireworks && window.Fireworks.default) {
    return window.Fireworks.default;
  }

  return window.Fireworks || null;
}

function createFireworks() {
  const FireworksClass = getFireworksClass();

  if (!scene || fireworksInstance || !FireworksClass || reducedMotion.matches) {
    return;
  }

  fireworksInstance = new FireworksClass(scene, {
    autoresize: true,
    opacity: 0.45,
    acceleration: 1.02,
    friction: 0.97,
    gravity: 1.18,
    particles: 78,
    traceLength: 3,
    traceSpeed: 10,
    explosion: 6,
    intensity: 24,
    flickering: 50,
    lineStyle: "round",
    hue: {
      min: 24,
      max: 145
    },
    delay: {
      min: 24,
      max: 48
    },
    rocketsPoint: {
      min: 30,
      max: 70
    }
  });
}

function updateAudioButton() {
  if (!audioButton || !audio) {
    return;
  }

  const isPlaying = !audio.paused;
  audioButton.setAttribute("aria-pressed", String(isPlaying));
  audioButton.textContent = isPlaying ? "Hentikan Takbiran" : "Putar Takbiran";
}

async function playAudio() {
  if (!audio) {
    return;
  }

  try {
    await audio.play();
  } catch (error) {
    console.warn("Audio tidak dapat diputar otomatis.", error);
  } finally {
    updateAudioButton();
  }
}

function pauseAudio() {
  if (!audio) {
    return;
  }

  audio.pause();
  updateAudioButton();
}

function openGreeting() {
  if (!puzzleCompleted || greetingOpened) {
    return;
  }

  greetingOpened = true;
  closeFeedbackModal();
  body.classList.add("is-open");
  scene.setAttribute("aria-hidden", "false");
  createFireworks();
  fireworksInstance?.start();
  playAudio();

  window.setTimeout(() => {
    intro.hidden = true;
  }, 820);
}

resetButton?.addEventListener("click", resetPuzzle);
openButton?.addEventListener("click", openGreeting);
modalActionButton?.addEventListener("click", openGreeting);
modalCloseButton?.addEventListener("click", closeFeedbackModal);
modalDismissButton?.addEventListener("click", closeFeedbackModal);
feedbackModal?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
    closeFeedbackModal();
  }
});
thrButton?.addEventListener("click", (event) => {
  if (!puzzleCompleted || !greetingOpened) {
    event.preventDefault();
    return;
  }

  window.open(thrButton.href, "_blank", "noopener,noreferrer");
  event.preventDefault();
  registerThrClaim();
});

audioButton?.addEventListener("click", () => {
  if (!audio) {
    return;
  }

  if (audio.paused) {
    playAudio();
    return;
  }

  pauseAudio();
});

audio?.addEventListener("play", updateAudioButton);
audio?.addEventListener("pause", updateAudioButton);
audio?.addEventListener("ended", updateAudioButton);

document.addEventListener("visibilitychange", () => {
  if (!fireworksInstance || !greetingOpened) {
    return;
  }

  if (document.hidden) {
    fireworksInstance.stop();
    return;
  }

  fireworksInstance.start();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !feedbackModal.hidden) {
    closeFeedbackModal();
  }
});

resetPuzzle();
updateAudioButton();
