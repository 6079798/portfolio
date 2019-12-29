import "core-js/stable/dom-collections/for-each";

import objectFitImages from "object-fit-images";
import SmoothScroll from "smooth-scroll";

import "./sliders";
import "./forms";
import { debounce } from "./helpers";

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

objectFitImages(".portfolio__img img");

SmoothScroll("[data-scroll]", {
  updateURL: false,
  speedAsDuration: true
});

const navBtn = document.querySelector("[data-nav-toggle]");
const navContainer = document.querySelector(".nav");
const page = document.body;
const badges = document.querySelectorAll(".hero__badge");
const hero = document.querySelector(".hero");
const distance = 30;
const toTopTrigger = document.querySelector("[data-top-trigger]");
const toTopBtn = document.querySelector("[data-top]");

const toggleNav = () => {
  navBtn.classList.toggle("nav-btn--active");
  navContainer.classList.toggle("nav--shown");
  page.classList.toggle("page--no-scroll");
};

const toggleToTopBtn = trigger => {
  const { top } = trigger.getBoundingClientRect();
  if (top <= window.innerHeight) {
    toTopBtn.classList.add("scroll-top--is-shown");
  } else toTopBtn.classList.remove("scroll-top--is-shown");
};

function shadow(event) {
  const width = hero.offsetWidth;
  const height = hero.offsetHeight;

  let { offsetX: x, offsetY: y } = event;

  if (this !== event.target) {
    x = x + event.target.offsetLeft;
    y = y + event.target.offsetTop;
  }

  const xWalk = Math.round((x / width) * distance - distance / 2);
  const yWalk = Math.round((y / height) * distance - distance / 2);

  badges.forEach(
    badge =>
      (badge.style.textShadow = `${xWalk}px ${yWalk}px 4px rgba(0, 0, 0, 0.08)`)
  );
}

navBtn.addEventListener("click", toggleNav);

hero.addEventListener("mousemove", shadow);

hero.addEventListener("transitionend", ({ target }) => {
  if (target.matches(".hero__badge"))
    target.classList.add("hero__badge--no-transition");
});

document.addEventListener("scrollStart", ({ detail: { toggle } }) => {
  if (
    toggle.parentElement.matches(".nav__link") &&
    navContainer.matches(".nav--shown")
  )
    toggleNav();
});

window.addEventListener(
  "scroll",
  debounce(() => {
    toggleToTopBtn(toTopTrigger);
  }),
  false
);

window.onload = () => {
  badges.forEach(badge => {
    badge.classList.remove("hero__badge--moved");
  });
};
