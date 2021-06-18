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
  olList,
} = elements;
const { API_HOST, API_KEY, BY_BREED } = api;
let predictionTimeout = null;

window.storage = {};

const getPhotos = async function (breed) {
  try {
    axios.defaults.headers.common["x-api-key"] = API_KEY;

    const response = await axios.get(`${API_HOST}${BY_BREED}${breed}`, {
      params: { limit: 12, size: "full" },
    });

    const data = response.data.map((data) => data.url);

    if (!response.data[0].breeds.length) return null;

    return data;
  } catch (err) {
    return null;
  }
};

input.addEventListener("input", function (e) {
  const searchString =
    e.target.value.charAt(0).toUpperCase() + input.value.slice(1);
  if (predictionTimeout) clearTimeout(predictionTimeout);
  if (searchString.length < 3) {
    olList.style.display = "none";
    return;
  }
  predictionTimeout = setTimeout(() => {
    const breedName = window.storage.breeds.breedName;
    const filteredBreeds = breedName.filter((character) =>
      character.includes(searchString)
    );

    predictionList.innerHTML = "";
    olList.style.display = "none";

    if (!filteredBreeds.length) return;

    const markup = filteredBreeds.map((name) => serachMarkup(name));

    predictionList.insertAdjacentHTML("beforeend", markup.join(""));
    olList.style.display = "block";
    predictionList.querySelectorAll("[data-id]").forEach((element) =>
      element.addEventListener("click", function (e) {
        input.value = e.target.innerText;

        handleFormSumbition(e.target.getAttribute("data-id"));
        predictionList.innerHTML = "";
        olList.style.display = "none";
      })
    );
  }, 500);
});

function serachMarkup(name) {
  const id = window.storage.breeds.breedName.indexOf(name);
  const html = /* html */ `
    <li class="search-list__suggestion" data-id="${window.storage.breeds.breedID[id]}">${name}</li>`;
  return html;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!input.value) return;
  const cutName = getBreedID(
    input.value.charAt(0).toUpperCase() + input.value.slice(1)
  );

  olList.style.display = "none";

  if (predictionTimeout) clearTimeout(predictionTimeout);
  handleFormSumbition(cutName);
});

const handleFormSumbition = async function (id) {
  const swiperContainer = document.getElementById("swiper");
  if (!input.value) return;
  input.value = "";

  const photos = await getPhotos(id);
  if (!photos) return;

  if (!headerContainer.classList.contains("changeDirection"))
    headerContainer.classList.add("changeDirection");

  if (swiperContainer) swiperContainer.remove();

  swiperContainter(photos);
};

const breedList = async function () {
  try {
    const response = await axios.get(`https://api.thecatapi.com/v1/breeds`);
    const breedName = response.data.map((data) => data.name);
    const breedID = response.data.map((data) => data.id);

    const conectedArrays = breedName.reduce((acc, name, index) => {
      return [...acc, { name, id: breedID[index] }];
    }, []);

    return { breedID, breedName };
  } catch (err) {
    console.log(err);
  }
};

const loadBreedList = function () {
  button.removeAttribute("disabled");
};

(async function () {
  storage.breeds = await breedList();
  loadBreedList();
})();

const getBreedID = function (fullName) {
  const breedName = window.storage.breeds.breedName;
  const breedID = window.storage.breeds.breedID;
  const index = breedName.indexOf(fullName);

  if (!breedName.includes(fullName)) return " ";

  return breedID[index];
};
