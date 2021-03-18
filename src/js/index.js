import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";

import "regenerator-runtime/runtime";

Swiper.use([Navigation, Pagination]);

const form = document.querySelector(".search");
const headerContainer = document.querySelector(".header");
// const h1 = document.querySelector("h1");

const createMarkup = function (url) {
  const markup = /* html */ `
    <div class="swiper-container">
    
      <div class="swiper-wrapper">       
          <div class="swiper-slide polaroid-item"><img src="../img(temporary)/cat-2.png" alt=""></div>
          <div class="swiper-slide polaroid-item"><img src="./src/img(temporary)/cat-3.png" alt=""></div>
          <div class="swiper-slide polaroid-item"><img src="./src/img(temporary)/cat-3.png" alt=""></div>
      </div>

        <div class="swiper-pagination"></div>

        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>
    `;

  headerContainer.insertAdjacentHTML("afterend", markup);
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!headerContainer.classList.contains("changeDirection"))
    headerContainer.classList.add("changeDirection");

  createMarkup("./src/img(temporary)/cat-3.png");

  new Swiper(".swiper-container", {
    spaceBetween: 40,
    slidesPerView: "2",
    pagination: {
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});

// const renderPhoto = function (breed) {
//   const markup = "";
// };

const breedList = async function (breed) {
  const res = await fetch(
    `https://api.thecatapi.com/v1/breeds/search?q=${breed}`
  );
  const data = await res.json();
  console.log(data);
};
breedList("sib");
