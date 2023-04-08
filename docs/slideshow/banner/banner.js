import html from "https://cdn.skypack.dev/hyperlit"

export default ({ id, title, text }) => {
  let style = ["one", "two", "three", "four"][(id + 0) % 4]
  return html` <div key=${"k-" + id} class=${"banner banner--" + style}>
    <h1>${title}</h1>
    <p>${text}</p>
  </div>`
}
