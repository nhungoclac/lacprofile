// Dark / Light Mode
const toggleBtn = document.getElementById("darkModeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const root = document.body;

if (localStorage.getItem("theme") === "dark") {
  root.classList.add("dark");
  themeIcon.className = "fas fa-sun";
  themeText.innerText = "Chế độ sáng";
} else {
  themeIcon.className = "fas fa-moon";
  themeText.innerText = "Chế độ tối";
}
toggleBtn.addEventListener("click", () => {
  root.classList.toggle("dark");
  const isDark = root.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeIcon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  themeText.innerText = isDark ? "Chế độ sáng" : "Chế độ tối";
});

// Live Clock
function updateClock() {
  const now = new Date();
  const clockDiv = document.getElementById("liveClock");
  if (clockDiv) clockDiv.innerText = now.toLocaleTimeString("vi-VN");
}
setInterval(updateClock, 1000);
updateClock();

// Random Quote
const quotes = [
  "✨ Code như nghệ thuật",
  "🌟 Sáng tạo không giới hạn",
  "🚀 Mỗi dòng code đều có linh hồn",
  "💡 UX là tình yêu",
  "🎨 Làm đẹp từ những chi tiết nhỏ",
  "⚡ Tối giản nhưng tinh tế",
  "🌙 Dark mode đẹp hơn!",
  "🎯 Học hỏi mỗi ngày",
];
function randomQuote() {
  const quoteDiv = document.getElementById("randomQuote");
  if (quoteDiv)
    quoteDiv.innerText = quotes[Math.floor(Math.random() * quotes.length)];
}
randomQuote();
setInterval(randomQuote, 20000);

// Formspree + Guestbook
const form = document.getElementById("anonymousForm");
const statusDiv = document.getElementById("formStatus");
let guestMessages = JSON.parse(localStorage.getItem("guestbook_msgs") || "[]");

function saveGuestbook() {
  localStorage.setItem("guestbook_msgs", JSON.stringify(guestMessages));
}
function escapeHtml(str) {
  return str.replace(
    /[&<>]/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m],
  );
}
function renderGuestbook() {
  const container = document.getElementById("guestbookList");
  if (!container) return;
  if (guestMessages.length === 0) {
    container.innerHTML =
      '<div class="guest-message"><i>📭 Chưa có tin nhắn nào. Hãy là người đầu tiên!</i></div>';
    return;
  }
  container.innerHTML = guestMessages
    .slice(0, 12)
    .map(
      (msg) =>
        `<div class="guest-message"><div class="guest-name">${escapeHtml(msg.name)}</div><div>${escapeHtml(msg.message)}</div><div style="font-size:0.6rem;opacity:0.6;">${new Date(msg.timestamp).toLocaleString()}</div></div>`,
    )
    .join("");
}
function addGuestMessage(name, message) {
  if (!message.trim()) return;
  guestMessages.unshift({
    name: name.substring(0, 30),
    message: message.substring(0, 150),
    timestamp: Date.now(),
  });
  if (guestMessages.length > 20) guestMessages.pop();
  saveGuestbook();
  renderGuestbook();
}
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Đang gửi...';
    const formData = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        statusDiv.innerHTML =
          '<span style="color:#16a34a;">✅ Gửi thành công! Cảm ơn bạn.</span>';
        const nameField =
          document.getElementById("anonName")?.value.trim() || "Ẩn danh";
        const msgField = form.querySelector('textarea[name="message"]').value;
        addGuestMessage(nameField, msgField);
        form.reset();
      } else {
        statusDiv.innerHTML =
          '<span style="color:#dc2626;">❌ Gửi thất bại, thử lại sau.</span>';
      }
    } catch (err) {
      statusDiv.innerHTML =
        '<span style="color:#dc2626;">❌ Lỗi kết nối!</span>';
    }
  });
}
document.getElementById("clearGuestbookBtn")?.addEventListener("click", () => {
  guestMessages = [];
  saveGuestbook();
  renderGuestbook();
});
renderGuestbook();

// Like counter
let likeCounter = parseInt(localStorage.getItem("likeCount") || "0");
const likeSpan = document.getElementById("likeCount");
if (likeSpan) likeSpan.innerText = likeCounter;
document.getElementById("likeBtn")?.addEventListener("click", () => {
  likeCounter++;
  localStorage.setItem("likeCount", likeCounter);
  if (likeSpan) likeSpan.innerText = likeCounter;
});

// Fun fact
const funFacts = [
  "🐱 Mèo phát ra 100 âm thanh",
  "🌌 2 nghìn tỷ thiên hà",
  "💻 Plankalkül - ngôn ngữ đầu tiên",
  "🎨 Dark mode tiết kiệm pin",
  "✨ Formspree xử lý 1 triệu form/tháng",
];
const factSpan = document.getElementById("funFact");
document.getElementById("newFactBtn")?.addEventListener("click", () => {
  if (factSpan)
    factSpan.innerText = funFacts[Math.floor(Math.random() * funFacts.length)];
});
if (factSpan) factSpan.innerText = funFacts[0];

// Music Player
const audioPlayer = document.getElementById("audioPlayer");
const songSelect = document.getElementById("songSelect");
const songNameSpan = document.getElementById("songName");
songSelect?.addEventListener("change", function () {
  if (this.value) {
    audioPlayer.src = this.value;
    audioPlayer.style.display = "block";
    if (songNameSpan)
      songNameSpan.innerText = this.options[this.selectedIndex].text;
  } else {
    audioPlayer.style.display = "none";
    if (songNameSpan) songNameSpan.innerText = "Chưa chọn bài";
  }
});
document.getElementById("playSongBtn")?.addEventListener("click", () => {
  if (audioPlayer.src) audioPlayer.play();
  else alert("Chọn bài hát trước!");
});
document.getElementById("stopSongBtn")?.addEventListener("click", () => {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
});

// Album (chỉ chạy khi có albumGrid)
const albumImages = [
  {
    url: "photo/qs2.jpg",
    caption: "Quân sự 2022",
  },
  {
    url: "photo/ctxh2.jpg",
    caption: "TGL 2023 (Vũng Tàu)",
  },
  {
    url: "photo/ctxh1.jpg",
    caption: "MĐYT 2023 (Dak Nong)",
  },
  {
    url: "photo/vt2023.jpg",
    caption: "Vũng Tàu 2024",
  },
  {
    url: "photo/VT2025.jpg",
    caption: "Vũng Tàu 2025",
  },
  { url: "photo/nct2025.jpg", caption: "Nam Cát Tiên 2025" },
  {
    url: "photo/qb2025.jpg",
    caption: "Quảng Bình 2025",
  },
  {
    url: "photo/hue2025.jpg",
    caption: "Huế 2025",
  },
];
function renderAlbum() {
  const grid = document.getElementById("albumGrid");
  if (!grid) return;
  grid.innerHTML = albumImages
    .map(
      (img, i) =>
        `<div class="album-item" data-index="${i}"><img src="${img.url}" alt="${img.caption}" loading="lazy"><div class="album-caption">${img.caption}</div></div>`,
    )
    .join("");
  document.querySelectorAll(".album-item").forEach((item) => {
    item.addEventListener("click", () => {
      const idx = item.dataset.index;
      openModal(albumImages[idx].url, albumImages[idx].caption);
    });
  });
}
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
function openModal(src, cap) {
  if (modal) modal.style.display = "block";
  if (modalImg) modalImg.src = src;
  if (modalCaption) modalCaption.innerHTML = cap;
}
document.querySelector(".modal-close")?.addEventListener("click", () => {
  if (modal) modal.style.display = "none";
});
window.onclick = function (e) {
  if (e.target === modal && modal) modal.style.display = "none";
};
// Chạy album nếu đang ở trang album
if (document.getElementById("albumGrid")) renderAlbum();
