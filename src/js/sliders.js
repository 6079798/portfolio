import { tns } from "tiny-slider/src/tiny-slider";

const portfolioSlider = tns({
  container: ".portfolio__items",
  gutter: 20,
  controls: false,
  nav: true,
  mouseDrag: true,
  navPosition: "bottom",
  items: 1,
  preventScrollOnTouch: "auto",
  loop: false,
  rewind: true,
  responsive: {
    768: {
      items: 2
    },
    992: {
      gutter: 35
    },
    1200: {
      items: 3,
      gutter: 30,
      nav: false,
      controls: true
    }
  }
});
