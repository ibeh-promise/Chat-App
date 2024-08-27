console.log("hello")
const dataName = document.getElementById("dataName")
const dbEmail = document.getElementById("dataEmail")
const Logo = document.getElementById("main-logo")
const dbName = document.getElementById("dbName")
const btnDelete = document.getElementById("btn-delete")
const modalDiv = document.querySelector(".modal-div")
const abortBtn = document.getElementById("abort-btn")

async function getProfile() {
  await fetch("/api/test")
  .then(response => response.json())
  .then(data => {
    data.data.map(user => {
      console.log(user)
      dataName.textContent = user.name;
      dbName.textContent = user.name;
      dbEmail.textContent = user.email;
      console.log(user.name)
      console.log(dbName)
    })
  })
}

Logo.addEventListener("click", () => {
  window.location.href = "/home"
});

btnDelete.addEventListener("click", () =>{
  modalDiv.style.display = "block"
})
abortBtn.addEventListener("click", () =>{
  modalDiv.style.display = "none"
})

getProfile()