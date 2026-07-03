const message = document.getElementById("message");
const userContainer = document.getElementById("users");
const deleteAllBtn = document.getElementById("deleteAll");
const showAllBtn = document.getElementById("showAll");

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function getUsersFromStorage() {
  const data = localStorage.getItem("users");

  if (data === null) {
    return null;
  }

  return JSON.parse(data);
}

function saveUsersToStorage(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function renderUsers(users) {
  userContainer.innerHTML = "";

  if (users.length === 0) {
    message.textContent = "Пользователей нет";
    return;
  }

  message.textContent = "";

  users.forEach(user => {
    const card = document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `
      <h3>${user.name} ${user.surname}</h3>
      <p>Email: ${user.email}</p>
      <p>Возраст: ${user.age}</p>
      <p>Город: ${user.city}</p>
      <button>Удалить</button>
    `;

    const deleteBtn = card.querySelector("button");

    deleteBtn.addEventListener("click", () => {
      deleteUser(user.id);
    });

    userContainer.append(card);
  });
}

function deleteUser(id) {
  const users = getUsersFromStorage();

  const updatedUsers = users.filter(user => {
    return user.id !== id;
  });

  saveUsersToStorage(updatedUsers);

  renderUsers(updatedUsers);
}

async function loadUsers() {
  try {
    message.textContent = "Данные загружаются...";

    await delay(2000);

    const response = await fetch("./async.json");

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    saveUsersToStorage(data.users);

    localStorage.setItem("usersLoaded", "true");

    renderUsers(data.users);

  } catch (error) {
    console.error(error);

    message.textContent = "Ошибка при загрузке данных";
  }
}

deleteAllBtn.addEventListener("click", () => {
  const users = getUsersFromStorage();

  if (!users || users.length === 0) {
    message.textContent = "Пользователей уже нет";
    return;
  }

  saveUsersToStorage([]);

  renderUsers([]);
});

showAllBtn.addEventListener("click", async () => {
  const users = getUsersFromStorage();

  if (users && users.length > 0) {
    message.textContent = "Все пользователи уже отображаются";
    return;
  }

  await loadUsers();
});

function init() {
  const users = getUsersFromStorage();

  const usersLoaded = localStorage.getItem("usersLoaded");

  if (users === null && !usersLoaded) {
    loadUsers();
  } else {
    renderUsers(users || []);
  }
}

init();