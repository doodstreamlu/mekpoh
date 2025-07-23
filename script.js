const JSON_URL = 'https://raw.githubusercontent.com/DoodstreamPro/_e/refs/heads/main/Video.json';

// Ambil video ID dari pathname
const pathParts = window.location.pathname.split('/');
const videoId = pathParts[pathParts.length - 1]; // Ambil bagian terakhir (ULfESVEvS1)

const videoPlayer = document.getElementById('video-player');
const videoTitle = document.getElementById('video-title');
const overlayControls = document.getElementById('overlay-controls');
const playOverlayBtn = document.getElementById('play-overlay-btn');
const backwardBtn = document.getElementById('backward-btn');
const forwardBtn = document.getElementById('forward-btn');
const videoContainer = document.getElementById('video-container');

let hideControlsTimeout;

// Fungsi untuk menampilkan kontrol overlay sementara
function showOverlayControls() {
  clearTimeout(hideControlsTimeout);
  overlayControls.style.opacity = '0.9';
  overlayControls.style.pointerEvents = 'auto';
  if (player.playing) {
    hideControlsTimeout = setTimeout(() => {
      overlayControls.style.opacity = '0';
      overlayControls.style.pointerEvents = 'none';
    }, 3000); // Sembunyikan overlay setelah 3 detik
  }
}

// Inisialisasi Plyr
const player = new Plyr(videoPlayer, {
  controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings', 'fullscreen'],
  settings: ['speed'],
  speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
  autoplay: false,
  loop: { active: true },
  muted: true
});

// Pastikan kontrol Plyr selalu aktif
player.on('ready', () => {
  const plyrControls = document.querySelector('.plyr__controls');
  if (plyrControls) {
    plyrControls.style.display = 'flex';
  }
  showOverlayControls(); // Tampilkan overlay saat video dimuat
});

// Pusatkan video jika landscape
player.on('loadedmetadata', () => {
  const videoWidth = videoPlayer.videoWidth;
  const videoHeight = videoPlayer.videoHeight;
  if (videoWidth > videoHeight) {
    videoContainer.classList.add('flex', 'justify-center', 'items-center');
    videoPlayer.classList.add('max-w-full', 'max-h-full');
  } else {
    videoContainer.classList.remove('flex', 'justify-center', 'items-center');
    videoPlayer.classList.remove('max-w-full', 'max-h-full');
  }
});

// Toggle kontrol overlay saat tombol play di tengah diklik
playOverlayBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  player.togglePlay();
  if (player.playing) {
    showOverlayControls(); // Mulai timer untuk menyembunyikan overlay saat play
  } else {
    showOverlayControls(); // Tampilkan overlay tanpa timer saat pause
    clearTimeout(hideControlsTimeout); // Batalkan timer jika ada
  }
});

// Toggle overlay controls saat video diklik
videoContainer.addEventListener('click', (e) => {
  if (e.target.closest('#overlay-controls')) return;
  showOverlayControls();
});

// Update ikon play/pause saat video diputar atau dijeda
player.on('play', () => {
  playOverlayBtn.querySelector('i').classList.remove('fa-play');
  playOverlayBtn.querySelector('i').classList.add('fa-pause');
  showOverlayControls(); // Mulai timer untuk menyembunyikan overlay
});

player.on('pause', () => {
  playOverlayBtn.querySelector('i').classList.remove('fa-pause');
  playOverlayBtn.querySelector('i').classList.add('fa-play');
  showOverlayControls(); // Tampilkan overlay tanpa timer
  clearTimeout(hideControlsTimeout); // Batalkan timer
});

// Fungsi untuk mendeteksi double-click
let lastClickTimeBackward = 0;
let lastClickTimeForward = 0;
const DOUBLE_CLICK_THRESHOLD = 300; // Milidetik untuk mendeteksi double-click

backwardBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const currentTime = Date.now();
  if (currentTime - lastClickTimeBackward < DOUBLE_CLICK_THRESHOLD) {
    player.currentTime = Math.max(0, player.currentTime - 10);
    showOverlayControls(); // Tampilkan overlay setelah skip
  }
  lastClickTimeBackward = currentTime;
});

forwardBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const currentTime = Date.now();
  if (currentTime - lastClickTimeForward < DOUBLE_CLICK_THRESHOLD) {
    player.currentTime = Math.min(player.duration, player.currentTime + 10);
    showOverlayControls(); // Tampilkan overlay setelah skip
  }
  lastClickTimeForward = currentTime;
});

// Ambil data JSON
if (videoId) {
  fetch(JSON_URL)
    .then(response => response.json())
    .then(data => {
      const video = data.find(v => v.id === videoId);
      if (video) {
        videoPlayer.src = video.Url;
        videoTitle.textContent =’inf

### Explanation of Changes:
- **Pathname Handling**:
  - Updated the video ID extraction to use `window.location.pathname.split('/')` and take the last segment (`pathParts[pathParts.length - 1]`), which works for both `/ULfESVEvS1` and `/e/ULfESVEvS1` since the ID is the final segment.
- **Landscape Video Centering**:
  - Added a `loadedmetadata` event listener to check `videoWidth > videoHeight`.
  - If true (landscape), added Tailwind classes (`flex`, `justify-center`, `items-center`) to `videoContainer` and `max-w-full`, `max-h-full` to `videoPlayer` to center the video.
  - If not landscape, these classes are removed to maintain the original `object-contain` behavior.
- **Plyr Controls**:
  - Removed the `hideControls` configuration and ensured the Plyr control bar is always visible by setting `display: flex` in the `ready` event and removing any code that hides it.
  - The `showOverlayControls` function now only manages the overlay controls, leaving the Plyr control bar unaffected.
- **Other Functionality**:
  - Maintained the 3-second overlay control display on video click or skip during playback.
  - Kept the overlay controls visible without a timeout when paused or initially loaded.
  - Preserved double-click functionality for backward/forward buttons and no autoplay.
- **Styling**: The `style.css` remains unchanged, retaining the "cool" design with blur, glow animations, and smooth transitions.

### How It Works:
- **Video ID**: Extracted from the pathname's last segment (e.g., `ULfESVEvS1` from `/e/ULfESVEvS1` or `/ULfESVEvS1`).
- **Video Centering**: Landscape videos are centered using flexbox; portrait videos use the full container.
- **Controls**:
  - The Plyr control bar is always visible, allowing volume control, seeking, etc.
  - Overlay controls appear for 3 seconds when the video is clicked during playback or after a skip, and remain visible when paused or initially loaded.
- **Behavior**:
  - The video starts paused, requiring user interaction to play.
  - Double-clicking backward/forward buttons skips 10 seconds and shows the overlay controls briefly.
- **Styling**: The sleek look with frosted glass and glowing buttons is unchanged.

Let me know if you need further adjustments, such as changing the timeout duration, tweaking the centering logic, or enhancing the styling!
