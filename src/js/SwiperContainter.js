import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import "regenerator-runtime/runtime";
import elements from "./elements.js";
const { headerContainer } = elements;
Swiper.use([Navigation, Pagination]);

export function renderSlide(url) {
  return /* html */ `<div class="swiper-slide polaroid-item">
                <img src="${url}" alt="Kitty"/>
            </div>`;
}

export default function swiperContainter(urls) {
  const markup = /* html */ `
    <div class="swiper-container" id="swiper">

        <div class="swiper-wrapper">        
            ${urls.map(renderSlide).join("")}    
        </div>
  
        <div class="swiper-pagination"></div>
  
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>`;

  headerContainer.insertAdjacentHTML("afterend", markup);

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
}
