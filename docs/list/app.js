import { app } from "https://unpkg.com/hyperapp"
import html from "https://unpkg.com/hyperlit"
const withEnterKey = (action, payload) => (state, ev) =>
  ev.key === "Enter" ? [action, payload] : state
const withTargetValue = action => (state, event) => [action, event.target.value]
const Input = (state, entry) => ({ ...state, entry })
const Add = state =>
  !state.entry
    ? state
    : {
        ...state,
        items: [{ id: state.count + 1, text: state.entry }, ...state.items],
        count: state.count + 1,
        entry: null,
      }
const Remove = (state, id) => ({
  ...state,
  items: state.items.filter(item => item.id !== id),
})

export default (node, demoFlags) =>
  app({
    node,
    init: {
      count: 0,
      items: [],
      entry: null,
    },
    view: state => html` <div class="list">
      <div class="list__input-container">
        <input
          type="text"
          value=${state.entry}
          placeholder="type something"
          oninput=${withTargetValue(Input)}
          onkeypress=${withEnterKey(Add)}
        />
        <button onclick=${Add}>+</button>
      </div>

      <ul class="list__items">
        <transition-group
          entry=${demoFlags.entry && "list__item--entry"}
          slide=${demoFlags.slide && "list__item--slide"}
          exit=${demoFlags.exit && "list__item--exit"}
        >
          ${state.items.map(
            item => html`
              <li class="list__item" key=${"k-" + item.id}>
                <span>${item.text}</span>
                <button onclick=${[Remove, item.id]}>x</button>
              </li>
            `
          )}
        </transition-group>
      </ul>
    </div>`,
  })
