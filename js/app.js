let box = document.querySelector(".box-cards");
let templateCards = document.querySelector("template").content;
const inputSelect = document.querySelector("select");
const input = document.getElementById("input");

var after;
var next;

let fragment = new DocumentFragment();

document.addEventListener("DOMContentLoaded", () => {
  input.value = "";
  inputSelect.value = "Seleccionar";
  fetchData();
});

const fetchData = async () => {
  try {
    const res = await fetch("https://rickandmortyapi.com/api/character");
    const json = await res.json();
    const data = json.results;
    next = json.info.next;
    after = null;
    // console.log(json);
    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCards = (data) => {
  box.innerHTML = "";
  fragment.content = "";

  data.forEach((element) => {
    templateCards.querySelector(".name").textContent =
      element.id + ")" + element.name;
    templateCards.querySelector("img").setAttribute("src", element.image);
    templateCards.querySelector(".gender").textContent = element.gender;
    templateCards.querySelector(".status").textContent = element.status;

    let clone = templateCards.cloneNode(true);
    fragment.appendChild(clone);
  });

  box.appendChild(fragment);
};

input.addEventListener("keyup", async (e) => {
  e.preventDefault();
  after = null;
  if (e.target.value != "") {
    let character = e.target.value;
    // console.log(e);
    let url1 = "https://rickandmortyapi.com/api/character/?name=" + character;
    let url2 =
      "https://rickandmortyapi.com/api/character/?name=" +
      character +
      "&status=" +
      inputSelect.value;

    let resp = await fetch(inputSelect.value == "Seleccionar" ? url1 : url2);
    let respJson = await resp.json();
    // console.log("reeeeeee", respJson);
    if (resp.ok == false) {
      box.innerHTML = "";
      after = null;
      next = null;
      const center = document.createElement("center");

      const p = document.createElement("p");
      p.textContent = JSON.stringify(respJson.error);

      center.appendChild(p);

      box.appendChild(center);
    } else {
      // let respJson = await resp.json();
      let dataResp = respJson.results;
      next = respJson.info.next;
      // console.log('data',dataResp);
      pintarCards(dataResp);
    }
  } else if (e.target.value != "" && inputSelect != "Seleccionar") {
    let resp = await fetch(
      "https://rickandmortyapi.com/api/character/?status=" + inputSelect.value
    );
    let respJson = await resp.json();
    let dataResp = respJson.results;
    next = respJson.info.next;
    // console.log('data',dataResp);
    pintarCards(dataResp);
  } else if (e.target.value == "" && inputSelect != "Seleccionar") {
    let resp = await fetch(
      "https://rickandmortyapi.com/api/character/?status=" + inputSelect.value
    );
    let respJson = await resp.json();
    let dataResp = respJson.results;
    next = respJson.info.next;
    // console.log('data',dataResp);
    pintarCards(dataResp);
  } else {
    await fetchData();
    input.value = "";
  }
});

inputSelect.addEventListener("change", async (e) => {
  e.preventDefault();
  after = null;
  if (e.target.value != "Seleccionar" || input.value != "") {
    try {
      let character = input.value;
      let url1 = "https://rickandmortyapi.com/api/character/?name=" + character;
      let url2 =
        "https://rickandmortyapi.com/api/character/?name=" +
        character +
        "&status=" +
        e.target.value;
      let resp = await fetch(e.target.value == "Seleccionar" ? url1 : url2);
      let respJson = await resp.json();
      if (resp.ok != false) {
        // console.log("next change", next);
        // console.log("data", resp.ok);
        let dataResp = respJson.results;
        next = respJson.info.next;
        pintarCards(dataResp);
      } else {
        next = null;
        box.innerHTML = "";
        const center = document.createElement("center");

        const p = document.createElement("p");
        p.textContent = "No FOUND.......";

        center.appendChild(p);

        box.appendChild(center);
      }
    } catch (error) {
      box.innerHTML = "";
      const center = document.createElement("center");

      const p = document.createElement("p");
      p.textContent = "No FOUND.......";

      center.appendChild(p);

      box.appendChild(center);
      console.log(error);
    }
  } else {
    input.value = "";
    await fetchData();
  }
});

nextPage = async () => {
  // console.log("next data", next);
  if (next != null) {
    const res = await fetch(next);
    const json = await res.json();
    const data = json.results;
    next = json.info.next;
    after = json.info.prev;
    window.scrollTo(0, 0);
    pintarCards(data);
  }
};
afterPage = async () => {
  // console.log("after data", after);
  if (after != null) {
    const res = await fetch(after);
    const json = await res.json();
    const data = json.results;
    after = json.info.prev;
    next = json.info.next;
    window.scrollTo(0, 0);
    pintarCards(data);
  }
};
