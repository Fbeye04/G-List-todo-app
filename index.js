const userName = document.getElementById("username");
const userPosition = document.getElementById("userPosition");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");
const inputBox = document.getElementById("taskInput");
const submitBtn = document.getElementById("submit-btn");
const tasksContainer = document.getElementById("list-today");
const priorityBtns = document.querySelectorAll(".chip-btn");
const dateInput = document.getElementById("dateInput");
const completedList = document.getElementById("completedList");

// lihat terlebih dahulu apakah ada item username dan user position di local storage
const storedName = localStorage.getItem("username");
const storedPosition = localStorage.getItem("userPosition");

// nilai awal prioritas tugas agar tidak kosong
let currentPriority = "low";

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

function addTask(e) {
  e.preventDefault(); /* berhentikan reload akibat button submit di dalam form karena langsung mengirim data ke server dan memuat ulang */

  const taskText =
    inputBox.value.trim(); /* mengambil nilai dari input sekaligus menghapus spasi di awal dan akhir kalimat */
  const taskDate = dateInput.value;
  let date =
    ""; /* variabel penampung nilai taskDate dahulu agar nanti kalau ada kosong bisa diolah agar tidak langsung kosong */

  // if statement untuk memberi peringatan jika tidak ada judul/deskripsi tugas
  if (taskText.length === 0) {
    alert("The task title must be written down");
    return;
  }

  if (taskDate === "") {
    date = "No date";
  } else {
    date = taskDate;
  }

  // container tugas per satuan (berbeda dengan task-by date yang bersifat tempa kumpul semua tugas)
  const taskItem = document.createElement("div");
  taskItem.classList.add("tasks");

  taskItem.innerHTML = `
    <div class="check-detail">
        <input
            type="checkbox"
            name="checkbox"
            id="checkbox"
            aria-label="Tandai tugas sebagai selesai" />

        <div class="detail-task">
            <h4>${taskText}</h4>

            <div class="additional-info">
                <span class="priority ${currentPriority}">${currentPriority}</span>
                <div class="deadline">
                    <span class="material-symbols-outlined">
                        calendar_today
                    </span>
                    <span class="due">${date}</span>
                </div>
            </div>
        </div>
    </div>

    <button class="delete-btn" aria-label="Hapus tugas">
        <span class="material-symbols-outlined"> close </span>
    </button>
    `;

  tasksContainer.appendChild(taskItem);

  const targetedCheckbox = taskItem.querySelector('input[type="checkbox"]');

  targetedCheckbox.addEventListener("change", () => {
    if (targetedCheckbox.checked) {
      completedList.appendChild(taskItem);
      taskItem.classList.add("completed");
    } else {
      tasksContainer.appendChild(taskItem);
      taskItem.classList.remove("completed");
    }
  });

  const deleteBtn = taskItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    taskItem.remove();
  });

  // mengosongkan dan mengembalikan nilai input maupun currentPriority
  inputBox.value = "";
  currentPriority = "low";
  dateInput.value = "";
}

submitBtn.addEventListener("click", addTask);

// teknik mudah agar tidak menulis satu persatu event listener dari tiap button priority
priorityBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    priorityBtns.forEach((item) => {
      item.classList.remove("active");
    });

    btn.classList.add("active");

    currentPriority = btn.dataset.value;
  });
});
