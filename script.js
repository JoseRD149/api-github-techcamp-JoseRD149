const APIURL = 'https://api.github.com/users/'

// Referencias al formulario, el campo de búsqueda y la sección principal
const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

// Función para obtener la información del usuario de la API
async function getUser(username) {
    try {
      console.log(`Fetching user: ${username}`); // Mensaje para verificar
      const response = await axios.get(APIURL + username); // Corrected variable name
      console.log(response.data); // Ver los datos obtenidos
      createUserCard(response.data);
      getRepos(username);
    } catch (error) {
      console.error(error); // Ver detalles del error
      if (error.response && error.response.status === 404) {
        createErrorCard("User not found.");
      } else {
        createErrorCard("An error occurred. Please try again.");
        
      }
    }
  }
  

// Función para obtener los repositorios del usuario
async function getRepos(username) {
  try {
    const { data } = await axios.get(`${APIURL}${username}/repos?sort=created`); // Corrected variable name
    addReposToCard(data);
  } catch (err) {
    console.error(err); // Log the error details
    createErrorCard("Could not fetch repositories.");
  }
}

// Crear la tarjeta del perfil del usuario
function createUserCard(user) {
  const cardHTML = `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${user.name || "No Name Available"}</h2>
        <p>${user.bio || "No bio available."}</p>
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repositories</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;
  main.innerHTML = cardHTML;
}

// Agregar repositorios a la tarjeta
function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos
    .slice(0, 5) // Limitar a los 5 repositorios más recientes
    .forEach(repo => {
      const repoEl = document.createElement("a");
      repoEl.classList.add("repo");
      repoEl.href = repo.html_url;
      repoEl.target = "_blank";
      repoEl.textContent = repo.name;
      reposEl.appendChild(repoEl);
    });
}

// Mostrar mensaje de error
function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
      <h1>${msg}</h1>
    </div>
  `;
  main.innerHTML = cardHTML;
}

// Manejar el envío del formulario
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = search.value.trim();
    if (username) {
      getUser(username);
      search.value = "";
    }
  });
