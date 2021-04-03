import api from "./api.js";
import axios from "axios";
import swiperContainter, { renderSlide } from "./SwiperContainter";
import elements from "./elements.js";
const {
  form,
  headerContainer,
  input,
  button,
  swiperContainer,
  predictionList,
} = elements;
const { API_HOST, API_KEY, BY_BREED } = api;

// const h1 = document.querySelector("h1");
window.storage = {};

const photosOfSpecificBreed = async function (breed) {
  try {
    axios.defaults.headers.common["x-api-key"] = API_KEY;

    // https://api.thecatapi.com/v1/images/search?breed_ids=beng
    const response = await axios.get(`${API_HOST}${BY_BREED}${breed}`, {
      params: { limit: 10, size: "full" },
    });
    // console.log(response);

    const data = response.data.map((data) => data.url);

    // console.log(data);

    swiperContainter(data);
  } catch (err) {
    console.log(err);
  }
};

let predictionTimeout = null;

input.addEventListener("input", function (e) {
  const searchString = e.target.value;
  if (searchString.length < 3) return;
  if (predictionTimeout) clearTimeout(predictionTimeout);
  predictionTimeout = setTimeout(() => {
    const breedName = window.storage.breeds.breedName;
    const filteredBreeds = breedName.filter((character) =>
      character.includes(searchString)
    );

    console.log(filteredBreeds);
    predictionList.innerHTML = "";

    if (!filteredBreeds.length) return;

    const markup = filteredBreeds.map((name) => serachMarkup(name));
    console.log(markup);
    predictionList.insertAdjacentHTML("beforeend", markup.join(""));
    predictionList.querySelectorAll("[data-id]").forEach((element) =>
      element.addEventListener("click", function (e) {
        input.value = e.target.innerText;
        console.log(e.target.getAttribute("data-id"));
        handleFormSumbition(e.target.getAttribute("data-id"));
      })
    );
  }, 500);
});

function serachMarkup(name) {
  const id = window.storage.breeds.breedName.indexOf(name);
  const html = /* html */ `
    <li data-id="${window.storage.breeds.breedID[id]}">${name}</li>`;
  return html;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const cutName = getBreedID(input.value);

  handleFormSumbition(cutName);
});

const handleFormSumbition = function (id) {
  const swiperContainer = document.getElementById("swiper");
  if (!input.value) return;
  input.value = "";

  if (!headerContainer.classList.contains("changeDirection"))
    headerContainer.classList.add("changeDirection");

  if (swiperContainer) swiperContainer.remove();

  photosOfSpecificBreed(id);
};

const breedList = async function () {
  try {
    const response = await axios.get(`https://api.thecatapi.com/v1/breeds`);
    // console.log(response.data);
    const breedName = response.data.map((data) => data.name);
    const breedID = response.data.map((data) => data.id);

    const conectedArrays = breedName.reduce((acc, name, index) => {
      return [...acc, { name, id: breedID[index] }];
    }, []);
    console.log(conectedArrays);
    return { breedID, breedName };
  } catch (err) {
    console.log(err);
  }
};
//
// wybrać button i dać mi disable
const loadBreedList = function () {
  button.removeAttribute("disabled");
  // console.log(window.storage.breeds);
};

(async function () {
  storage.breeds = await breedList();
  loadBreedList();
  console.log("Done");
})();

// psedua klasa disabled w cssie dorób
const getBreedID = function (fullName) {
  const breedName = window.storage.breeds.breedName;
  const breedID = window.storage.breeds.breedID;

  const index = breedName.indexOf(fullName);
  if (!breedName.includes(fullName)) return " ";

  return breedID[index];
};
