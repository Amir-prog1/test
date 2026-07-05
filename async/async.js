const message = document.getElementById("message");
const userContainer = document.getElementById("users");
const deleteAllBtn = document.getElementById("deleteAll");
const showAllBtn = document.getElementById("showAll");
const controls = document.getElementById("controls");

let users = [];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getUsersFromStorage() {
  const data = localStorage.getItem("users");

  if (data === null) {
    return null;
  }

  return JSON.parse(data);
}

function saveUsersToStorage(data) {
  users = data;
  localStorage.setItem("users", JSON.stringify(data));
}

function createCard(user) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${user.name} ${user.surname}</h3>
    <p>Email: ${user.email}</p>
    <p>Возраст: ${user.age}</p>
    <p>Город: ${user.city}</p>
    <button>Удалить</button>
  `;

  card.querySelector("button").addEventListener("click", () => {
    deleteUser(user.id);
  });

  return card;
}

function renderUsers(data) {
  userContainer.innerHTML = "";

  if (!data || data.length === 0) {
    message.textContent = "Пользователей нет";
    return;
  }

  message.textContent = "";

  data.forEach(user => {
    userContainer.appendChild(createCard(user));
  });
}

function deleteUser(id) {
  users = users.filter(user => user.id !== id);

  saveUsersToStorage(users);
  renderUsers(users);
}

async function loadUsers() {
  try {
    message.textContent = "Данные загружаются...";

    await delay(3000);

    const response = await fetch("./async.json");

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    saveUsersToStorage(data.users);

    users = data.users;
    renderUsers(users);

    controls.style.display = "block";

  } catch (error) {
    console.error(error);
    message.textContent = "Ошибка при загрузке данных";
  }
}

deleteAllBtn.addEventListener("click", () => {
  if (users.length === 0) {
    message.textContent = "Пользователей уже нет";
    return;
  }

  users = [];
  saveUsersToStorage(users);
  renderUsers(users);
});

showAllBtn.addEventListener("click", async () => {
  if (users.length > 0) {
    message.textContent = "Все пользователи уже загружены";
    return;
  }

  await loadUsers();
});

function init() {
  users = getUsersFromStorage();

  if (users === null) {
    loadUsers();
  } else {
    renderUsers(users);
    controls.style.display = "block";
  }
}

init();