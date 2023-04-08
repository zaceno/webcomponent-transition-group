import html from "https://cdn.skypack.dev/hyperlit"
import "https://unpkg.com/webcomponent-transition-group"

const display = ({ direction }, content) => html` <div
  class="slideshow__display"
>
  <transition-group
    entry=${"slideshow-entry-" + direction}
    exit=${"slideshow-exit-" + direction}
  >
    ${content}
  </transition-group>
</div>`

//"\u2190"
const navLeft = ({ onnav }) => html`<button
  class="slideshow__nav-left"
  onclick=${onnav}
  >${"\u00AB"}</button
>`
//
const navRight = ({ onnav }) => html`<button
  class="slideshow__nav-right"
  onclick=${onnav}
  >${"\u00BB"}</button
>`

const navTo = ({ onnav, current, index }) => html`<button
  class=${current === index ? "slideshow__nav-list--current" : ""}
  onclick=${[onnav, index]}
></button>`

const navList = ({ length, current, onnav }) => html`<ul
  class="slideshow__nav-list"
>
  ${[...Array(length).keys()].map(
    index => html`
      <li>
        <${navTo} current=${current} index=${index} onnav=${onnav} />
      </li>
    `
  )}
</ul>`

const controls = props => html`
  <div
    class=${"slideshow__controls" +
    (!props.showControls ? " slideshow__controls--hidden" : "")}
  >
    <${navLeft} onnav=${props.onleft} />
    <${navRight} onnav=${props.onright} />
    <${navList}
      length=${props.length}
      current=${props.current}
      onnav=${props.onto}
    />
  </div>
`

export default (props, slide) => html` <div
  class="slideshow"
  onmouseover=${[props.onhover, true]}
  onmouseout=${[props.onhover, false]}
>
  <${display} direction=${props.direction}>${slide}<//>
  <${controls} ${props} />
</div>`
