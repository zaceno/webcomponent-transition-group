//TODO: debounce handling resize/scroll events

const doTransition = (elem, trigger, after) => {
  let n = 0
  let starthandler = () => n++
  let endhandler = () => {
    if (--n) return
    elem.removeEventListener("transitionrun", starthandler)
    elem.removeEventListener("transitionend", endhandler)
    elem.removeEventListener("transitioncancel", endhandler)
    after()
  }
  elem.addEventListener("transitionrun", starthandler)
  elem.addEventListener("transitionend", endhandler)
  elem.addEventListener("transitioncancel", endhandler)
  requestAnimationFrame(trigger)
}

const offset = elem => {
  let rect = elem.getBoundingClientRect()
  let dx = elem._tx_rect.x - rect.x
  let dy = elem._tx_rect.y - rect.y
  elem._tx_rect = rect
  if ((dx | dy) === 0) return false
  elem.style.translate = `${dx}px ${dy}px`
  return true
}

class TransitionGroup extends HTMLElement {
  #previous = []

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.shadowRoot.append(
      ...[...document.querySelectorAll("style")].map(n => n.cloneNode(true))
    )
    this.shadowRoot.append(
      ...[...document.querySelectorAll("link[rel=stylesheet]")].map(n =>
        n.cloneNode()
      )
    )
    let slot = document.createElement("slot")
    slot.addEventListener("slotchange", () => {
      this.#handleSlotChange()
    })
    this.shadowRoot.append(slot)
    window.addEventListener("resize", () => {
      this.#handleLayoutChange()
    })
    window.addEventListener("scroll", () => {
      this.#handleLayoutChange()
    })
  }

  #handleLayoutChange() {
    this.#previous.forEach(elem => {
      elem._tx_rect = elem.getBoundingClientRect()
    })
  }

  #handleSlotChange() {
    let current = [...this.childNodes]
    let added = current.filter(node => !this.#previous.includes(node))
    let removed = this.#previous.filter(node => !current.includes(node))
    let updated = current.filter(node => !added.includes(node))
    added.forEach(elem => this.#onadd(elem))
    updated.forEach(elem => this.#onupdate(elem))
    removed.forEach(elem => this.#onremove(elem))
    this.#previous = current
  }

  #onadd(elem) {
    elem._tx_rect = elem.getBoundingClientRect()
    let clsentry = this.getAttribute("entry")
    if (!clsentry) return
    let clsentryPre = clsentry + "-pre"
    elem.classList.add(clsentryPre)
    doTransition(
      elem,
      () => elem.classList.replace(clsentryPre, clsentry),
      () => elem.classList.remove(clsentry)
    )
  }

  #onupdate(elem) {
    let clsslide = this.getAttribute("slide")
    if (!clsslide) {
      elem._tx_rect = elem.getBoundingClientRect()
      return
    }
    if (!offset(elem)) return
    doTransition(
      elem,
      () => {
        elem.classList.add(clsslide)
        elem.style.translate = null
      },
      () => elem.classList.remove(clsslide)
    )
  }

  #onremove(elem) {
    let clsremove = this.getAttribute("exit")
    if (!clsremove) return
    this.shadowRoot.append(elem)
    offset(elem)
    doTransition(
      elem,
      () => elem.classList.add(clsremove),
      () => elem.parentNode && this.shadowRoot.removeChild(elem)
    )
  }
}
customElements.define("transition-group", TransitionGroup)
export {}
