let charactersList = [],
  nextRowId = 1;
function loadSavedData() {
  let e = localStorage.getItem("charactersList");
  e && ((charactersList = JSON.parse(e)), displayCharacters());
}
function searchCharacter() {
  let e = document.getElementById("characterName"),
    t = document.getElementById("errorMessages");
  document.getElementById("charactersSection"), (t.innerHTML = "");
  let a = e.value.split(",").map((e) => e.trim());
  if (0 === a.length) {
    t.innerHTML = "Por favor, digite pelo menos um nome de personagem.";
    return;
  }
  showLoading(),
    Promise.all(
      a.map((e) => {
        let a = `https://api.tibiadata.com/v4/character/${encodeURIComponent(
          e
        )}`;
        return fetch(a)
          .then((e) => e.json())
          .then((a) => {
            if (a.character) {
              let r = a.character.character;
              charactersList.push(r);
            } else t.innerHTML += `Personagem n\xe3o encontrado: ${e}.<br>`;
          })
          .catch((a) => {
            console.error(`Erro na requisi\xe7\xe3o \xe0 API para ${e}:`, a),
              (t.innerHTML += `Erro na requisi\xe7\xe3o \xe0 API para ${e}.<br>`);
          });
      })
    )
      .then(() => {
        hideLoading(), displayCharacters();
      })
      .catch((e) => {
        console.error("Erro ao buscar personagens:", e), hideLoading();
      });
}
function changeCharacterColor(e, t) {
  let a = document.getElementById("charactersTableBody"),
    r = a.getElementsByTagName("tr");
  e < r.length &&
    ((r[e].cells[0].style.backgroundColor = t), (charactersList[e].color = t));
}

function showLoading() {
  let e = document.getElementById("loading");
  e && (e.style.display = "block");
}
function hideLoading() {
  let e = document.getElementById("loading");
  e && (e.style.display = "none");
}
function addToTable(e) {
  let t = charactersList[e],
    a = document.getElementById("charactersTableBody"),
    r = a.insertRow(),
    n = `row_${nextRowId++}`;
  (r.id = n),
    (r.innerHTML = `
          <td>${t.name}</td>
          <td>${t.level}</td>
          <td>${t.world}</td>
          <td><button class="brush-button" onclick="openColorPicker('${n}', ${e})"><i class="fas fa-paint-brush"></i></button></td>
          <td><button class="delete-button" onclick="deleteRow('${n}', ${e})"><i class="fas fa-trash"></i></button></td>
        `),
    charactersList.splice(e, 1),
    displayCharacters();
}
function displayCharacters() {
  let e = document.getElementById("charactersSection");
  e.innerHTML = "";
  let t = Math.min(charactersList.length, 24);
  for (let a = 0; a < t; a++) {
    let r = charactersList[a],
      n = document.createElement("div");
    (n.className = "character-info"),
      (n.style.backgroundColor = r.color),
      (n.innerHTML = `<p><strong>Nome:</strong> ${r.name}</p><p><strong>Level:</strong> ${r.level}</p><p><strong>Mundo:</strong> ${r.world}</p><button onclick="addToTable(${a})">Adicionar \xe0 Tabela</button>`),
      e.appendChild(n);
  }
}
function changeRowColor(e, t) {
  let a = document.getElementById(e);
  a && (a.style.backgroundColor = t);
}
function openColorPicker(e, t) {
  let a = document.createElement("input");
  (a.type = "color"),
    a.addEventListener("input", function () {
      changeRowColor(e, a.value);
    }),
    a.click();
}
function deleteRow(e, t) {
  let a = document.getElementById(e);
  a && a.remove();
}
function saveDataToLocalStorage() {
  localStorage.setItem("charactersList", JSON.stringify(charactersList));
}
function loadDefaultCharacters() {
  showLoading(),
    Promise.all(
      [
        "Bvri",
        "Piturinha de Limao",
        "Pibe Stylo",
        "Sayah Lyron",
        "Wuhaf",
        "Carsebas",
        "Balcksz Kymed",
        "Baratss",
        "Lady Celene",
        "Shen Kina",
        "Conni Tank",
        "Parakina",
        "Dreehsz",
        "Mitcek",
      ].map((e) => {
        let t = `https://api.tibiadata.com/v4/character/${encodeURIComponent(
          e
        )}`;
        return fetch(t)
          .then((e) => e.json())
          .then((t) => {
            if (t.character) {
              let a = t.character.character;
              charactersList.push(a);
            } else console.error(`Personagem n\xe3o encontrado: ${e}`);
          })
          .catch((t) => {
            console.error(`Erro na requisi\xe7\xe3o \xe0 API para ${e}:`, t);
          });
      })
    )
      .then(() => {
        hideLoading(), displayCharacters();
      })
      .catch((e) => {
        console.error("Erro ao carregar personagens padr\xf5es:", e),
          hideLoading();
      });
}
function addAllToTable() {
  let e = document.getElementById("charactersTableBody");
  charactersList.forEach((t, a) => {
    let r = e.insertRow(),
      n = `row_${nextRowId++}`;
    (r.id = n),
      (r.innerHTML = `
          <td>${t.name}</td>
          <td>${t.level}</td>
          <td>${t.world}</td>
          <td><button class="brush-button" onclick="openColorPicker('${n}', ${a})"><i class="fas fa-paint-brush"></i></button></td>
          <td><button class="delete-button" onclick="deleteRow('${n}', ${a})"><i class="fas fa-trash"></i></button></td>
        `);
  }),
    (charactersList = []),
    displayCharacters();
}
document.addEventListener("DOMContentLoaded", function () {
  loadSavedData();
});

function refreshTable() {
  showLoading();

  // Obtém os nomes dos personagens na tabela
  let characterNamesInTable = charactersList.map((character) => character.name);

  // Limpa a tabela
  charactersList = [];
  nextRowId = 1;
  let tableBody = document.getElementById("charactersTableBody");
  tableBody.innerHTML = "";

  // Pesquisa novamente os personagens na tabela
  Promise.all(
    characterNamesInTable.map((characterName) => {
      let apiUrl = `https://api.tibiadata.com/v4/character/${encodeURIComponent(
        characterName
      )}`;

      return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.character) {
            let updatedCharacter = data.character.character;
            charactersList.push(updatedCharacter);

            // Adiciona os personagens de volta à tabela
            let newRow = tableBody.insertRow();
            let newRowIndex = `row_${nextRowId++}`;
            newRow.id = newRowIndex;
            newRow.innerHTML = `
              <td>${updatedCharacter.name}</td>
              <td>${updatedCharacter.level}</td>
              <td>${updatedCharacter.world}</td>
              <td><button class="brush-button" onclick="openColorPicker('${newRowIndex}', ${
              charactersList.length - 1
            })"><i class="fas fa-paint-brush"></i></button></td>
              <td><button class="delete-button" onclick="deleteRow('${newRowIndex}', ${
              charactersList.length - 1
            })"><i class="fas fa-trash"></i></button></td>
            `;
          } else {
            console.error(`Personagem não encontrado: ${characterName}`);
          }
        })
        .catch((error) => {
          console.error(
            `Erro na requisição à API para ${characterName}:`,
            error
          );
        });
    })
  )
    .then(() => {
      hideLoading();
    })
    .catch((error) => {
      console.error("Erro ao atualizar personagens:", error);
      hideLoading();
    });
}

function showPopup() {
  document.getElementById("popup").style.display = "block";
}

function hidePopup() {
  document.getElementById("popup").style.display = "none";
}
