const userName = document.getElementById("username");
const userPosition = document.getElementById("userPosition");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

// lihat terlebih dahulu apakah ada item username dan user position di local storage
const storedName = localStorage.getItem("username");
const storedPosition = localStorage.getItem("userPosition");

function updateClock() {
  const present = new Date(); /* mengetahui waktu sekarang */

  //   opsi tampilan seperti apa dari hari, tanggal, dan bulan begitu juga yang waktu
  const dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  //   mengubah nilai dari opsi hari dan waktu tadi menjadi teks
  const dateText = present.toLocaleDateString("en-US", dateOptions);
  const timeText = present.toLocaleTimeString("en-US", timeOptions);

  //   menempelkan teks hari dan waktu sebelumnya
  currentDate.textContent = dateText;
  currentTime.textContent = timeText;
}

// logika if terjadi saat nama sudah ada di local storage sedangkan else adalah kebalikannya
if (storedName) {
  userName.textContent = storedName;
  userPosition.textContent = storedPosition;
} else {
  const yourName = prompt("What's your name?");
  const yourPosition = prompt("What's your position?");
  localStorage.setItem("username", yourName);
  localStorage.setItem("userPosition", yourPosition);
  userName.textContent = yourName;
  userPosition.textContent = yourPosition;
}

/* jalankan updateClock berulan-ulang agar real-time tiap satu detik */
setInterval(updateClock, 1000);
/* pemanggilan fungsi agar saat pertama kali web digunakan tidak terjadi delay waktu akibat interval di atas */
updateClock();
