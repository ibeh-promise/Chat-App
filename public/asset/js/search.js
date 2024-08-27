let searchEl = document.getElementById("search-el");
let avaliableRoomBody = document.getElementById("avaliableRoomBody");
let backBtn = document.getElementById("back-btn");
const header = document.getElementById("header");
const createModal = document.getElementById("createModal");
const cancelBtn = document.getElementById("cancel-button");
const enterRoomBtn = document.getElementById("enterRoomBtn");
const roomPassword = document.getElementById("roomPassword");
const roomPasswordForm = document.getElementById("roomPasswordForm");
const passwordError = document.getElementById("passwordError");

let idCounter = 0;

fetch("/api").then(res => res.json()).then((data) => {
  console.log(data)
  data.data.forEach((item) => {
    console.log(item)
    let password = item.password;
    console.log(password);

    let div = document.createElement("div");
    div.classList.add("w-100");

    // Create the structure
    const div2 = document.createElement("div");
    div2.classList.add("container", "btn", "btn-dark", "wrapper", "rounded", "room");
    div2.id = `room-${idCounter}`; // Assign unique ID
    div.appendChild(div2);

    const div3 = document.createElement("div");
    div3.classList.add("d-flex", "align-items-center", "w-100");
    div2.appendChild(div3);

    const div4 = document.createElement("div");
    div4.classList.add("d-flex", "w-100", "align-items-center");
    div3.appendChild(div4);

    const i = document.createElement("i");
    i.classList.add("fs-2", "ml-30", "fa-solid", "fa-users", "w-70", "rounded", "bg-black", "px-2", "py-2");
    div4.appendChild(i);

    const p = document.createElement("p");
    p.classList.add("fs-6", "overflow-hidden", "mx-2", "m-auto", "d-block");
    p.id = `name-el-${idCounter}`;
    p.textContent = item.name;
    div4.appendChild(p);

    div2.addEventListener("click", () => {
      if (!password) {
        enterRoomPassword();
      } else {
        createModal.classList.remove("d-none")
          avaliableRoomBody.classList.add("d-none")
      }
     roomPasswordForm.addEventListener("submit", (e) => {
       e.preventDefault();
       const tableName = item.tablename
       console.log(roomPassword.value);
        console.log(password);
       if (roomPassword.value == password){
        fetch('/join/api', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: tableName,
            isMutable: true,
          }),
        })
       .then(response => {
           if (response.ok) {
             window.location.href = '/chat';
           } else {
             console.error('Error:', response.statusText);
           }
         })
         .catch(error => {
           console.error('Fetch error:', error);
         });
       }else {
         passwordError.textContent = "Wrong room ID";
       }
      })
    });

    function enterRoomPassword() {
      

      console.log(`ID: ${div2.id}, Name: ${item.name}`);
      const form = document.createElement("form");
      const input = document.createElement("input");
      const button = document.createElement("button");

      input.type = "text";
      input.value = item.tablename;
      input.name = "name";
      input.classList.add("fade");
      button.type = "submit";
      form.appendChild(input);
      form.appendChild(button);
      document.body.appendChild(form);
      console.log(`ID: ${div2.id}, Name: ${item.name}`);

      const tableName = item.tablename;
      console.log('Table name:', tableName);

      fetch('/join/api', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tableName,
          isMutable: true,
        }),
      })
      .then(response => {
        if (response.ok) {
          window.location.href = '/chat';
        } else {
          console.error('Error:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }

    avaliableRoomBody.appendChild(div);
    idCounter++;
  })
})

backBtn.addEventListener("click", () => {
  window.location.href = "../home";
})

searchEl.addEventListener("input", () => {
  const query = searchEl.value.trim();
  if (query) {
    fetch(`/search/api?query=${query}`)
      .then((res) => res.json())
      .then((data) => {
        avaliableRoomBody.innerHTML = ""; // Clear previous results
        if (data.length > 0) {
          data.forEach((item) => {
            let div = document.createElement("div");
            div.classList.add("w-100");

            // Create the structure
            const div2 = document.createElement("div");
            div2.classList.add("container", "btn", "btn-dark", "wrapper", "rounded", "room");
            div2.id = `room-${idCounter}`; // Assign unique ID
            div.appendChild(div2);

            const div3 = document.createElement("div");
            div3.classList.add("d-flex", "align-items-center", "w-100");
            div2.appendChild(div3);

            const div4 = document.createElement("div");
            div4.classList.add("d-flex", "w-100", "align-items-center");
            div3.appendChild(div4);

            const i = document.createElement("i");
            i.classList.add("fs-2", "ml-30", "fa-solid", "fa-users", "w-70", "rounded", "bg-black", "px-2", "py-2");
            div4.appendChild(i);

            const p = document.createElement("p");
            p.classList.add("fs-6", "overflow-hidden", "mx-2", "m-auto", "d-block");
            p.id = `name-el-${idCounter}`;
            p.textContent = item.name;
            div4.appendChild(p);

            div2.addEventListener("click", (e) => {          
              enterRoomPassword(item);
            });

            avaliableRoomBody.appendChild(div);
            idCounter++;              
          });
        } else {
          avaliableRoomBody.textContent = "No matching rooms found.";
        }
      })
      .catch((err) => {
        console.error("Search error:", err);
        avaliableRoomBody.textContent = "Error occurred while searching.";
      });
  } else {
    avaliableRoomBody.textContent = "Please enter a search room.";
  }
});

cancelBtn.addEventListener("click", () => {
    avaliableRoomBody.classList.remove("d-none")
  createModal.classList.add("d-none")
  // createBtn.classList.remove("d-none")
})
