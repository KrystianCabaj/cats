import api from "./api.js";
import axios from "axios";
import swiperContainter, { renderSlide } from "./SwiperContainter";
import elements from "./elements.js";
const { form, headerContainer, input, button, swiperContainer } = elements;
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

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const swiperContainer = document.getElementById("swiper");
  const cutName = cutBreedName(input.value);
  if (input.value === "") return;
  input.value = "";
  if (cutName === " ") return console.log("Wrong breed!");

  if (!headerContainer.classList.contains("changeDirection"))
    headerContainer.classList.add("changeDirection");

  if (swiperContainer) swiperContainer.remove();

  photosOfSpecificBreed(cutName);
});

const breedList = async function () {
  try {
    const response = await axios.get(`https://api.thecatapi.com/v1/breeds`);
    // console.log(response.data);
    const breedName = response.data.map((data) => data.name);
    const breedID = response.data.map((data) => data.id);

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
const cutBreedName = function (fullName) {
  const breedName = window.storage.breeds.breedName;
  const breedID = window.storage.breeds.breedID;

  const index = breedName.indexOf(fullName);
  if (!breedName.includes(fullName)) return " ";

  return breedID[index];
};
