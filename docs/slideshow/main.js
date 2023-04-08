import { app } from "https://cdn.skypack.dev/hyperapp"
import html from "https://cdn.skypack.dev/hyperlit"
import slides from "./slides.js"
import banner from "./banner/banner.js"
import slideshow from "./slideshow/slideshow.js"

const GoLeft = state => ({
  ...state,
  current: (state.current - 1 + slides.length) % slides.length,
  nav: "left",
})

const GoRight = state => ({
  ...state,
  current: (state.current + 1) % slides.length,
  nav: "right",
})

const GoTo = (state, index) =>
  index === state.current
    ? state
    : {
        ...state,
        current: index,
        nav: state.current < index ? "right" : "left",
      }

const Hover = (state, controls) => ({ ...state, controls })

app({
  node: document.getElementById("slideshow-demo"),
  init: { current: 0, nav: null, controls: false },
  view: state =>
    slideshow(
      {
        onhover: Hover,
        onleft: GoLeft,
        onright: GoRight,
        onto: GoTo,
        showControls: state.controls,
        direction: state.nav,
        current: state.current,
        length: slides.length,
      },
      banner(slides[state.current])
    ),
})
