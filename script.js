// Springfield.DB — integração com a API pública dos Simpsons
// Os cards são criados com JavaScript; nenhum personagem fica fixo no HTML.

const API_URL = "https://thesimpsonsapi.com/api/characters";
const IMAGE_CDN = "https://cdn.thesimpsonsapi.com/500";
const characterGrid = document.querySelector("#character-grid");
const resultMessage = document.querySelector("#result-message");
const totalCount = document.querySelector("#total-count");
const searchInput = document.querySelector("#search-input");
const reloadButton = document.querySelector("#reload-button");
const loadMoreButton = document.querySelector("#load-more");

let allCharacters = [];
let visibleCount = 12;

function getCharacterName(character) {
  return character.name || character.Nombre || character.nombre || "Personagem sem nome";
}

function getCharacterImage(character) {
  const image = character.portrait_path || character.image || character.Imagen || character.imagen || character.photo || "";
  if (image.startsWith("/")) return `${IMAGE_CDN}${image}`;
  return image;
}

function getCharacterDescription(character) {
  return character.occupation || character.status || character.gender ||
    character.Ocupacion || character.ocupacion || "Personagem de Springfield";
}

function getCharacterId(character, index) {
  return character._id || character.id || String(index + 1).padStart(3, "0");
}

function createCharacterCard(character, index) {
  const card = document.createElement("article");
  card.className = "character-card";

  const indexLabel = document.createElement("span");
  indexLabel.className = "card-index";
  indexLabel.textContent = `FILE // ${String(index + 1).padStart(3, "0")}`;

  const imageWrap = document.createElement("div");
  imageWrap.className = "card-image-wrap";

  const imageUrl = getCharacterImage(character);
  if (imageUrl) {
    const image = document.createElement("img");
    image.className = "card-image";
    image.src = imageUrl;
    image.alt = `Imagem de ${getCharacterName(character)}`;
    image.loading = "lazy";
    image.onerror = () => {
      image.remove();
      const placeholder = document.createElement("div");
      placeholder.className = "image-placeholder";
      placeholder.textContent = "Imagem indisponível";
      imageWrap.appendChild(placeholder);
    };
    imageWrap.appendChild(image);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "image-placeholder";
    placeholder.textContent = "Imagem não cadastrada";
    imageWrap.appendChild(placeholder);
  }

  const content = document.createElement("div");
  content.className = "card-content";

  const kicker = document.createElement("p");
  kicker.className = "card-kicker";
  kicker.textContent = "SPRINGFIELD CITIZEN";

  const name = document.createElement("h3");
  name.className = "card-name";
  name.textContent = getCharacterName(character);

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const description = document.createElement("span");
  description.textContent = getCharacterDescription(character);

  const id = document.createElement("span");
  id.className = "card-id";
  id.textContent = `#${getCharacterId(character, index)}`;

  meta.append(description, id);
  content.append(kicker, name, meta);
  card.append(indexLabel, imageWrap, content);

  return card;
}

function renderCharacters(characters) {
  characterGrid.replaceChildren();
  const visibleCharacters = characters.slice(0, visibleCount);

  if (visibleCharacters.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nenhum personagem encontrado. Tente outra busca.";
    characterGrid.appendChild(empty);
  } else {
    visibleCharacters.forEach((character, index) => {
      characterGrid.appendChild(createCharacterCard(character, index));
    });
  }

  resultMessage.textContent = `Exibindo ${visibleCharacters.length} de ${characters.length} personagem(ns).`;
  loadMoreButton.hidden = visibleCount >= characters.length;
}

function normalizeApiResponse(data) {
  // A API pode retornar um array diretamente ou um objeto contendo a lista.
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.docs)) return data.docs;
  if (data && Array.isArray(data.results)) return data.results;
  if (data && Array.isArray(data.personajes)) return data.personajes;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

async function loadCharacters() {
  reloadButton.disabled = true;
  reloadButton.textContent = "CARREGANDO...";
  resultMessage.textContent = "Conectando à API pública de Os Simpsons...";
  characterGrid.replaceChildren();

  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton";
    characterGrid.appendChild(skeleton);
  }

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`A API respondeu com status ${response.status}`);
    }

    const data = await response.json();
    allCharacters = normalizeApiResponse(data);

    if (allCharacters.length === 0) {
      throw new Error("A resposta da API não trouxe uma lista de personagens reconhecida.");
    }

    totalCount.textContent = (data.count || allCharacters.length).toLocaleString("pt-BR");
    visibleCount = 12;
    renderCharacters(allCharacters);
  } catch (error) {
    console.error("Erro ao carregar os personagens:", error);
    characterGrid.replaceChildren();
    const errorBox = document.createElement("div");
    errorBox.className = "empty-state";
    errorBox.textContent = "Não foi possível carregar os personagens agora. Verifique sua conexão e tente novamente. Se persistir, confira a disponibilidade da API.";
    characterGrid.appendChild(errorBox);
    resultMessage.textContent = "Falha na conexão com a API.";
    totalCount.textContent = "--";
  } finally {
    reloadButton.disabled = false;
    reloadButton.innerHTML = '<span aria-hidden="true">↻</span> ATUALIZAR DADOS';
  }
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = allCharacters.filter((character) => {
    const searchableText = [
      getCharacterName(character),
      getCharacterDescription(character)
    ].join(" ").toLocaleLowerCase("pt-BR");
    return searchableText.includes(query);
  });
  visibleCount = 12;
  renderCharacters(filtered);
});

reloadButton.addEventListener("click", loadCharacters);

loadMoreButton.addEventListener("click", () => {
  visibleCount += 12;
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = allCharacters.filter((character) => {
    return [getCharacterName(character), getCharacterDescription(character)]
      .join(" ").toLocaleLowerCase("pt-BR").includes(query);
  });
  renderCharacters(filtered);
});

loadCharacters();
