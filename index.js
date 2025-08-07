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

const _HTMLElement = typeof HTMLElement === "undefined" ? Object : HTMLElement

class TransitionGroup extends _HTMLElement {
  _eventListeners = []

  _bindEventListener(elem, event, handler) {
    elem.addEventListener(event, handler)
    this._eventListeners.push([elem, event, handler])
  }

  connectedCallback() {
    const handler = this._handleLayoutChange.bind(this)
    this._bindEventListener(window, "resize", handler)
    let parent = this
    while (parent.parentNode) {
      parent = parent.parentNode
      this._bindEventListener(parent, "scroll", handler)
    }
  }

  disconnectedCallback() {
    for (let [elem, event, handler] of this._eventListeners) {
      elem.removeEventListener(event, handler)
    }
  }

  constructor() {
    super()
    this._previous = []
    this.attachShadow({ mode: "open" })
    this.shadowRoot.append(
      ...[...document.querySelectorAll("style")].map(n => n.cloneNode(true)),
    )
    this.shadowRoot.append(
      ...[...document.querySelectorAll("link[rel=stylesheet]")].map(n =>
        n.cloneNode(),
      ),
    )
    let slot = document.createElement("slot")
    slot.addEventListener("slotchange", () => {
      this._handleSlotChange()
    })
    this.shadowRoot.append(slot)
  }

  _handleLayoutChange() {
    this._previous.forEach(elem => {
      elem._tx_rect = elem.getBoundingClientRect()
    })
  }

  _handleSlotChange() {
    let current = [...this.childNodes]
    let added = current.filter(node => !this._previous.includes(node))
    let removed = this._previous.filter(node => !current.includes(node))
    let updated = current.filter(node => !added.includes(node))
    added.forEach(elem => this._onadd(elem))
    updated.forEach(elem => this._onupdate(elem))
    removed.forEach(elem => this._onremove(elem))
    this._previous = current
  }

  _onadd(elem) {
    elem._tx_rect = elem.getBoundingClientRect()
    let clsentry = this.getAttribute("entry")
    if (!clsentry) return
    let clsentryPre = clsentry + "-pre"
    elem.classList.add(clsentryPre)
    doTransition(
      elem,
      () => elem.classList.replace(clsentryPre, clsentry),
      () => elem.classList.remove(clsentry),
    )
  }

  _onupdate(elem) {
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
      () => elem.classList.remove(clsslide),
    )
  }

  _onremove(elem) {
    let clsremove = this.getAttribute("exit")
    if (!clsremove) return
    this.shadowRoot.append(elem)
    offset(elem)
    doTransition(
      elem,
      () => elem.classList.add(clsremove),
      () => elem.parentNode && this.shadowRoot.removeChild(elem),
    )
  }
}

if (typeof customElements !== "undefined") {
  customElements.define("transition-group", TransitionGroup)
}

export {}
