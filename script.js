const challengeArea = document.getElementById("challenge-area");
const dropZones = [];
const checkButton = document.getElementById("check-btn");
const resetButton = document.getElementById("reset-btn");
const resultBox = document.getElementById("result");
const questionsUrl = "questions.json";
let draggedItem = null;

async function loadQuestions() {
  try {
    const response = await fetch(questionsUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.challenges || [];
  } catch (error) {
    resultBox.textContent =
      "Fragen konnten nicht geladen werden. Bitte öffne die App über einen lokalen Server oder prüfe questions.json.";
    return defaultQuestions();
  }
}

function defaultQuestions() {
  return [
    {
      id: "html-tags",
      title: "1. Ordne HTML-Tags ihren Beschreibungen zu",
      description:
        "Ziehe jedes HTML-Tag in die Beschreibung, die am besten passt.",
      difficulty: "easy",
      targets: [
        { answer: "nav", label: "Navigationsbereich" },
        {
          answer: "figure",
          label: "Selbstständiger Inhalt: z. B. Bild mit Bildunterschrift",
        },
        { answer: "footer", label: "Fußzeile der Seite mit Informationen" },
        { answer: "section", label: "Thematische Gruppierung von Inhalten" },
      ],
      items: [
        { value: "nav", label: "<nav>" },
        { value: "section", label: "<section>" },
        { value: "figure", label: "<figure>" },
        { value: "footer", label: "<footer>" },
      ],
    },
  ];
}

function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.id) {
    element.id = options.id;
  }

  if (options.textContent) {
    element.textContent = options.textContent;
  }

  if (options.htmlContent) {
    element.innerHTML = options.htmlContent;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
  }

  return element;
}

function shuffleArray(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createHintButton(questionId) {
  const button = createElement("button", {
    className: "hint-btn",
    textContent: "Lösungshinweis anzeigen",
    attributes: { type: "button", "data-hint-target": `hint-${questionId}` },
  });

  button.addEventListener("click", handleHintToggle);
  return button;
}

function createHintBox(questionId, hintText) {
  const hintBox = createElement("div", {
    className: "hint-box",
    id: `hint-${questionId}`,
  });
  hintBox.hidden = true;

  const hintParagraph = createElement("p", { textContent: hintText });
  hintBox.appendChild(hintParagraph);

  return hintBox;
}

function createChallengeCard(question) {
  const card = createElement("section", {
    className: `challenge-card ${question.difficulty}`,
  });

  const title = createElement("h2", { textContent: question.title });
  const badge = createElement("span", {
    className: `difficulty-badge ${question.difficulty}`,
    textContent:
      question.difficulty === "easy"
        ? "Leicht"
        : question.difficulty === "medium"
          ? "Mittelschwer"
          : "Schwer",
  });
  title.appendChild(badge);

  const description = createElement("p", { textContent: question.description });
  card.appendChild(title);
  card.appendChild(description);

  if (question.hint) {
    card.appendChild(createHintButton(question.id));
    card.appendChild(createHintBox(question.id, question.hint));
  }

  const targetGrid = createElement("div", { className: "challenge-grid" });
  question.targets.forEach((target) => {
    const zone = createElement("div", {
      className: "drop-zone",
      attributes: { "data-answer": target.answer },
    });
    const label = createElement("span", {
      className: "zone-label",
      textContent: target.label,
    });
    zone.appendChild(label);
    targetGrid.appendChild(zone);
  });

  const draggableList = createElement("div", {
    className: "draggable-list",
    id: `items-${question.id}`,
  });

  const shuffledItems = shuffleArray(question.items);
  shuffledItems.forEach((item) => {
    const draggable = createElement("div", {
      className: "draggable-item",
      textContent: item.label,
      attributes: {
        draggable: "true",
        "data-group": question.id,
        "data-value": item.value,
      },
    });
    draggableList.appendChild(draggable);
  });

  card.appendChild(targetGrid);
  card.appendChild(draggableList);

  return card;
}

function renderChallenges(questions) {
  challengeArea.innerHTML = "";
  questions.forEach((question) => {
    const card = createChallengeCard(question);
    challengeArea.appendChild(card);
  });
}

function attachDragHandlers() {
  document.querySelectorAll(".draggable-item").forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragend", handleDragEnd);
  });

  document.querySelectorAll(".drop-zone").forEach((zone) => {
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("dragleave", handleDragLeave);
    zone.addEventListener("drop", handleDrop);
  });
}

function handleDragStart(event) {
  draggedItem = event.target;
  draggedItem.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedItem.dataset.value);
}

function handleDragEnd(event) {
  event.target.classList.remove("dragging");
}

function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("active");
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove("active");
}

function handleDrop(event) {
  event.preventDefault();
  const dropZone = event.currentTarget;
  const draggedValue = event.dataTransfer.getData("text/plain");
  const dragged = draggedItem;

  if (!dragged || !draggedValue) {
    return;
  }

  const existingItem = dropZone.querySelector(".draggable-item");
  const originalContainer = dragged.parentElement;

  if (existingItem && originalContainer) {
    originalContainer.appendChild(existingItem);
  }

  dropZone.appendChild(dragged);
  dropZone.classList.remove("active");
}

function hideHints() {
  document.querySelectorAll(".hint-box").forEach((hintBox) => {
    hintBox.hidden = true;
  });
  document.querySelectorAll(".hint-btn").forEach((button) => {
    button.textContent = "Lösungshinweis anzeigen";
  });
}

function handleHintToggle(event) {
  const button = event.currentTarget;
  const targetId = button.dataset.hintTarget;
  const hintBox = document.getElementById(targetId);
  if (!hintBox) {
    return;
  }

  const isHidden = hintBox.hidden;
  hintBox.hidden = !isHidden;
  button.textContent = isHidden
    ? "Lösungshinweis verbergen"
    : "Lösungshinweis anzeigen";
}

function getContainerMap() {
  return Array.from(document.querySelectorAll(".draggable-list")).reduce(
    (map, container) => {
      map[container.id] = container;
      return map;
    },
    {},
  );
}

function resetChallenge() {
  const containers = getContainerMap();

  document.querySelectorAll(".drop-zone").forEach((zone) => {
    const item = zone.querySelector(".draggable-item");
    if (item) {
      const group = item.dataset.group;
      const targetContainer = containers[`items-${group}`];
      if (targetContainer) {
        targetContainer.appendChild(item);
      }
    }
  });

  resultBox.textContent =
    "Ziehe die Karten auf die richtigen Ziele und klicke dann auf Antworten prüfen.";
  clearResultStyles();
  hideHints();
}

function clearResultStyles() {
  document.querySelectorAll(".drop-zone").forEach((zone) => {
    zone.classList.remove("correct", "incorrect", "active");
  });
}

function checkAnswers() {
  let correctCount = 0;
  const zones = document.querySelectorAll(".drop-zone");
  zones.forEach((zone) => {
    const item = zone.querySelector(".draggable-item");
    const expected = zone.dataset.answer;
    const actual = item ? item.dataset.value : null;

    if (actual === expected) {
      zone.classList.add("correct");
      correctCount += 1;
    } else {
      zone.classList.add("incorrect");
    }
  });

  const total = zones.length;
  if (correctCount === total) {
    resultBox.textContent = `Perfekt! Du hast alle ${total} Aufgaben richtig gelöst.`;
  } else {
    resultBox.textContent = `Du hast ${correctCount} von ${total} richtig. Versuche es erneut oder setze die Übung zurück.`;
  }
}

async function initializeApp() {
  const challenges = await loadQuestions();
  renderChallenges(challenges);
  attachDragHandlers();
  document.querySelectorAll(".hint-btn").forEach((button) => {
    button.addEventListener("click", handleHintToggle);
  });
  checkButton.addEventListener("click", checkAnswers);
  resetButton.addEventListener("click", resetChallenge);
  hideHints();
  resultBox.textContent =
    "Ziehe die Karten auf die richtigen Ziele und klicke dann auf Antworten prüfen.";
}

initializeApp();
