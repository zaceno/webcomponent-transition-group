document.querySelector(".curtain__toggle").addEventListener("click", () => {
  let cont = document.querySelector(".curtain__container")
  console.log(cont)
  document
    .querySelector(".curtain__container")
    .classList.toggle("curtain__container--hidden")
})
