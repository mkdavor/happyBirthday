const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const loginScreen = document.querySelector("#loginScreen");
const dashboardScreen = document.querySelector("#dashboardScreen");
const panelContent = document.querySelector("#panelContent");
const panelNumber = document.querySelector(".panel-number");
const controlButtons = [...document.querySelectorAll(".control-button")];
const toast = document.querySelector("#toast");
const cakeModal = document.querySelector("#cakeModal");
const closeCake = document.querySelector("#closeCake");
const pictureModal = document.querySelector("#pictureModal");
const closePicture = document.querySelector("#closePicture");
const picturePreview = document.querySelector("#picturePreview");
const pictureTitle = document.querySelector("#pictureTitle");
const confettiLayer = document.querySelector("#confettiLayer");
const cordBead = document.querySelector(".cord-bead");
const cordLine = document.querySelector(".cord-line");
const hitArea = document.querySelector(".cord-hit");

let loginAttempts = 0;
let typedCommand = "";
let toastTimer;
let lampIsOn = false;
const clickSound = new Audio("https://assets.codepen.io/605876/click.mp3");

const luckyRewards = [
  "You won a virtual potato 🥔",
  "Nothing. Try next birthday.",
  "Congratulations. You are now responsible for buying the next round.",
  "You unlocked unlimited cake. Terms and conditions apply."
];

const wisdoms = [
  "Calories eaten on birthdays do not count. Source: trust me.",
  "If life gives you lemons, ask for rakija instead.",
  "Aging is just a software update you cannot skip.",
  "Today you are not older. You are just more expensive to maintain.",
  "Life is like freight: the best plans still depend on someone answering the phone.",
  "A good broker knows the rate. A great broker knows when the driver is definitely not ‘five minutes away.’",
  "Owning a freight company means every phone call is either an opportunity or a small emergency.",
  "Age is only a number. Unlike a freight rate, nobody gets to negotiate it.",
  "Keep calm and blame the market. It works in freight and at birthday parties.",
  "Axiomlog wisdom: trust the process, track the load, and never trust ‘almost delivered.’",
  "You do not get older in logistics. You simply gain more years of industry experience.",
  "May your lanes be profitable, your carriers reliable, and your birthday calls surprisingly brief.",
  "The secret to business is simple: move freight, solve problems, eat cake, repeat.",
  "Birthdays are like detention charges: they arrive faster than expected and somebody has to pay."
];

const panels = {
  gift: {
    number: "01 / 06",
    html: `
      <div class="panel-icon">🎁</div>
      <div class="eyebrow"><span></span> Annual upgrade package</div>
      <h2>Congratulations Ivica!<br><em>You unlocked:</em></h2>
      <ul class="reward-list">
        <li><span>Experience</span><strong>+1 year</strong></li>
        <li><span>Distinguished sparkle</span><strong>+3 gray hairs</strong></li>
        <li><span>Metabolism performance</span><strong>−10%</strong></li>
      </ul>
      <button class="secondary-button" data-action="claim">Claim reward</button>`
  },
  mission: {
    number: "02 / 06",
    html: `
      <div class="panel-icon">📜</div>
      <div class="eyebrow"><span></span> Today's critical objectives</div>
      <h2>Ivica's Birthday <em>Mission</em></h2>
      <p>Complete these tasks before midnight. The committee is watching.</p>
      <div class="mission-list">
        <label class="mission-item"><input type="checkbox"><span>Eat cake</span></label>
        <label class="mission-item"><input type="checkbox"><span>Reply “Thanks!”</span></label>
        <label class="mission-item"><input type="checkbox"><span>Pretend you're not getting old</span></label>
        <label class="mission-item impossible"><input type="checkbox" data-impossible><span>Survive another family gathering</span></label>
      </div>`
  },
  lucky: {
    number: "03 / 06",
    html: `
      <div class="panel-icon">🎰</div>
      <div class="eyebrow"><span></span> Odds definitely not disclosed</div>
      <h2>Test your <em>birthday luck</em></h2>
      <p>Every click brings you closer to absolutely no financial gain.</p>
      <div class="result-box" id="luckyResult">Your wildly valuable prize will appear here.</div>
      <button class="secondary-button" data-action="lucky">Press the lucky button</button>`
  },
  wisdom: {
    number: "04 / 06",
    html: `
      <div class="panel-icon">💡</div>
      <div class="eyebrow"><span></span> Questionable life guidance</div>
      <h2>Instant <em>wisdom</em></h2>
      <p>Advanced birthday intelligence, generated with confidence and no evidence.</p>
      <div class="result-box wisdom-result" id="wisdomResult">The universe is thinking. This could take a while.</div>
      <button class="secondary-button" data-action="wisdom">Generate wisdom</button>`
  },
  pictures: {
    number: "05 / 06",
    html: `
      <div class="panel-icon">🖼️</div>
      <div class="eyebrow"><span></span> Ivica's certified classics</div>
      <h2>Favourite <em>Pictures</em></h2>
      <p>A carefully curated gallery of important Ivica moments.</p>
      <div class="picture-grid">
        <button class="picture-card" data-picture="pic1.png" data-title="Swimming Pool"><div class="picture-art"><img src="pic1.png" alt="Ivica at the swimming pool"></div><strong>Swimming Pool</strong></button>
        <button class="picture-card" data-picture="pic2.png" data-title="Conquering the World"><div class="picture-art"><img src="pic2.png" alt="Ivica conquering the world"></div><strong>Conquering the World</strong></button>
        <button class="picture-card" data-picture="pic3.png" data-title="King Mode"><div class="picture-art"><img src="pic3.png" alt="Ivica in king mode"></div><strong>King Mode</strong></button>
      </div>`
  },
  exit: {
    number: "06 / 06",
    html: `
      <div class="panel-icon">🚪</div>
      <div class="eyebrow"><span></span> Request firmly rejected</div>
      <h2>You cannot <em>leave.</em></h2>
      <p>It is your birthday. Celebration protocol remains mandatory until cake levels reach zero.</p>
      <div class="result-box">Exit code 418: You are a birthday person.</div>
      <button class="secondary-button" data-action="exit">Try exiting anyway</button>`
  }
};

function showPanel(panelName) {
  const panel = panels[panelName];
  panelContent.style.animation = "none";
  void panelContent.offsetWidth;
  panelContent.innerHTML = panel.html;
  panelContent.style.animation = "panelIn .4s ease";
  panelNumber.textContent = panel.number;

  controlButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.panel === panelName);
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function toggleLamp() {
  lampIsOn = !lampIsOn;
  loginScreen.classList.toggle("lamp-on", lampIsOn);
  clickSound.play().catch(() => {});

  if (lampIsOn) {
    setTimeout(() => document.querySelector("#username").focus(), 550);
  }
}

gsap.registerPlugin(Draggable);

Draggable.create(hitArea, {
  type: "y",
  bounds: { minY: 0, maxY: 60 },
  onDrag() {
    gsap.set(cordBead, { y: this.y });
    gsap.set(cordLine, { attr: { y2: 180 + this.y } });
  },
  onRelease() {
    if (this.y > 30) toggleLamp();
    gsap.to([cordBead, hitArea], { y: 0, duration: .5, ease: "back.out(2.5)" });
    gsap.to(cordLine, { attr: { y2: 180 }, duration: .5, ease: "back.out(2.5)" });
  }
});

function launchConfetti() {
  const colors = ["#d2a968", "#f3e8ce", "#b87f55", "#7d8c66", "#e0bd75"];

  for (let index = 0; index < 75; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = randomFrom(colors);
    piece.style.setProperty("--duration", `${2.3 + Math.random() * 2.2}s`);
    piece.style.setProperty("--rotation", `${Math.random() * 360}deg`);
    piece.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    piece.style.animationDelay = `${Math.random() * .7}s`;
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function enterDashboard() {
  loginScreen.classList.remove("is-active");
  loginScreen.classList.add("is-leaving");

  setTimeout(() => {
    loginScreen.classList.remove("is-leaving");
    dashboardScreen.classList.add("is-active");
    showPanel("gift");
    launchConfetti();
  }, 520);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginAttempts += 1;
  loginMessage.className = "login-message";

  if (loginAttempts === 1) {
    loginMessage.textContent = "Incorrect. Your password cannot be ‘youngandbeautiful’ forever.";
    loginMessage.classList.add("error");
    return;
  }

  if (loginAttempts === 2) {
    loginMessage.textContent = "Still wrong. Have you tried remembering your own birthday?";
    loginMessage.classList.add("error");
    return;
  }

  loginMessage.textContent = "Fine, Ivica... it's your birthday anyway 🎉";
  loginMessage.classList.add("success");
  setTimeout(enterDashboard, 2000);
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.panel));
});

panelContent.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const picture = event.target.closest("[data-picture]");

  if (picture) {
    picturePreview.src = picture.dataset.picture;
    picturePreview.alt = picture.querySelector("img").alt;
    pictureTitle.textContent = picture.dataset.title;
    pictureModal.hidden = false;
    closePicture.focus();
  }

  if (action === "claim") showToast("Error 403: Reward already automatically applied.");
  if (action === "exit") showToast("You cannot leave. It is your birthday.");
  if (action === "lucky") document.querySelector("#luckyResult").textContent = randomFrom(luckyRewards);
  if (action === "wisdom") document.querySelector("#wisdomResult").textContent = randomFrom(wisdoms);
});

panelContent.addEventListener("change", (event) => {
  if (!event.target.matches("[data-impossible]")) return;
  event.target.checked = false;
  showToast("Mission impossible: Family gatherings have no known survival mode.");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !pictureModal.hidden) {
    pictureModal.hidden = true;
    return;
  }

  if (event.key === "Escape" && !cakeModal.hidden) {
    cakeModal.hidden = true;
    return;
  }

  if (event.key.length !== 1) return;
  typedCommand = (typedCommand + event.key.toLowerCase()).slice(-9);

  if (typedCommand === "sudo cake") {
    cakeModal.hidden = false;
    closeCake.focus();
    typedCommand = "";
  }
});

closeCake.addEventListener("click", () => { cakeModal.hidden = true; });
cakeModal.addEventListener("click", (event) => {
  if (event.target === cakeModal) cakeModal.hidden = true;
});
closePicture.addEventListener("click", () => { pictureModal.hidden = true; });
pictureModal.addEventListener("click", (event) => {
  if (event.target === pictureModal) pictureModal.hidden = true;
});

showPanel("gift");
