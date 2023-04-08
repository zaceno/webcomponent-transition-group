import { app } from "https://unpkg.com/hyperapp?module"
import html from "https://unpkg.com/hyperlit?module"
const SHUFFLE_LENGTH = 500
const swap = (squares, i, j) => {
  let news = [...squares]
  news[i] = squares[j]
  news[j] = squares[i]
  return news
}

const index2Coords = index => [index % 4, Math.floor(index / 4)]

const coords2Index = (col, row) => row * 4 + col

const relIndex = (index, dx, dy) => {
  let [ox, oy] = index2Coords(index)
  let [nx, ny] = [ox + dx, oy + dy]
  return coords2Index(nx, ny)
}

const move = (squares, square) => {
  let blankIndex = squares.indexOf(0)
  const [blankCol, blankRow] = index2Coords(blankIndex)
  const squareIndex = squares.indexOf(square)
  const [squareCol, squareRow] = index2Coords(squareIndex)
  const dx = blankCol < squareCol ? 1 : blankCol > squareCol ? -1 : 0
  const dy = blankRow < squareRow ? 1 : blankRow > squareRow ? -1 : 0
  if (!!dx && !!dy) return squares
  while (squareIndex !== blankIndex) {
    let nextIndex = relIndex(blankIndex, dx, dy)
    squares = swap(squares, blankIndex, nextIndex)
    blankIndex = nextIndex
  }
  return squares
}

const getMoves = squares => {
  let i = squares.indexOf(0)
  let [col, row] = index2Coords(i)
  return [
    0 + col,
    4 + col,
    8 + col,
    12 + col,
    row * 4,
    row * 4 + 1,
    row * 4 + 2,
    row * 4 + 3,
  ]
    .filter(x => x !== i)
    .map(x => squares[x])
}

const Move = (state, n) => {
  let squares = move(state.squares, n)
  let movable = getMoves(squares)
  return { ...state, squares, movable }
}

const Shuffle = state => {
  let squares = state.squares
  for (var i = 0; i < SHUFFLE_LENGTH; i++) {
    let moves = getMoves(squares)
    let square = moves[Math.floor(Math.random() * moves.length)]
    squares = move(squares, square)
  }
  return { ...state, squares, movable: getMoves(squares) }
}

const piece = (n, movable) => html` <div
  key=${"square-" + n}
  class=${["puzzle__square", { "puzzle__square--movable": movable }]}
  ${movable ? { onclick: [Move, n] } : {}}
  >${n}</div
>`

const blank = () => html` <div key="blank" class="puzzle__blank"></div>`

const INITIAL_SQUARES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]

app({
  init: {
    squares: [...INITIAL_SQUARES],
    movable: getMoves(INITIAL_SQUARES),
  },
  node: document.querySelector("#puzzle-demo"),
  view: state => html`<div class="puzzle">
    <transition-group class="puzzle__board" slide="puzzle__board--slide">
      ${state.squares.map(n =>
        n > 0 ? piece(n, state.movable.includes(n)) : blank()
      )}
    </transition-group>
    <button class="puzzle__shuffle" onclick=${Shuffle}>${"\u267B"}</button>
  </div>`,
})
