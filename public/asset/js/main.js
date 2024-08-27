const dbName = document.getElementById("dbName");
const prompt = document.getElementById("message-input");
const imageButton = document.getElementById("image-button");
const createBtn = document.getElementById("create-button");
const cancelBtn = document.getElementById("cancel-button");
const createRoom = document.getElementById("createRoom");
const createRoomBody = document.getElementById("createRoomBody");
const createModal = document.getElementById("createModal");
const message = document.getElementById("message");
const option = document.getElementById("option");
const searchEl = document.getElementById("search-el");
const deleteEl = document.getElementById("delete-msg2");
const check = document.getElementById("check");
const roomPassword = document.getElementById("room-password");
const inputPassword = document.getElementById("roomPassword");


// const room = document.querySelectorAll('[id*="room"]');


let username;
let inputName;
let msgArr = [];
let nameArr = [];
let imageData;

 message.textContent = "No rooms created"

function fetchApi() {
  fetch("/api/test")
    .then((res) => res.json())
    .then((data) => {
      console.log("dataz " + data);
      data.data.map((item) => {
        const username = item.name;
        const imageData = item.image;
        dbName.textContent = item.name;
        console.log(item);
      });

      console.log(data.chatData);
      let idCounter = 1; // Initialize ID counter

      data.chatData.forEach((item) => {
        console.log(item);
         

        const tableName = item.tablename;

         message.textContent = "All"

        let div = document.createElement("div");
        div.classList.add( "d-flex", "w-100", "justify-content-center");
        
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
        p.classList.add("fs-6", "overflow-hidden", "mx-2");
        p.id = `name-el-${idCounter}`;
        p.textContent = item.name;
        div4.appendChild(p);
       
        const i2 = document.createElement("i");
        i2.classList.add("fs-3", "ml-30", "fa-solid", "fa-trash", "mx-2");

        const btn = document.createElement("button");
        btn.classList.add("btn", "wrapper", "d-flex", "justify-content-center","align-items-center", "w-30", "text-light", "rounded", "container-x", "btn", "btn-dark", "room");
        
        btn.appendChild(i2)
        
        div.appendChild(btn);

        createRoomBody.appendChild(div);

        // Add event listener to the created div
        div2.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent default action

          console.log(`ID: ${div2.id}, Name: ${item.name}`);
          const form = document.createElement("form");
          const input = document.createElement("input");
          const button = document.createElement("button");
         // form.action = "/join/api";
          // form.method = "put";
          input.type = "text";
          input.value = item.tablename;
          input.name = "name";
          input.classList.add("fade")
          button.type = "submit";
          form.appendChild(input)
          form.appendChild(button)
          document.body.appendChild(form);
          console.log(`ID: ${div2.id}, Name: ${item.name}`);

            
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
        });
        idCounter++; // Increment ID counter
        btn.addEventListener("click", () => {
          console.log("clicked");
          if(item.admin){
              
              fetch('/deleteTable', {
                
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tableName })
                  })
                  .then(response => response.text())
                  .then(data => {
                    console.log(data);
                    if (response.ok) {
                      // Optionally remove the room element from the DOM
                      button.parentElement.remove();
                      // div.remove();
                    } else {
                      console.error('Failed to delete table:', data);
                    }
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });
                 div.remove()
            }
          })
        })
      })
    .catch((e) => {
      console.log("error", e);
      // location.href = "../login";
    });
}

check.addEventListener("change", () => {
  if (check.checked) {
    roomPassword.style.display = "none";
    inputPassword.removeAttribute("required");
  } else {
    roomPassword.style.display = "block";
    inputPassword.setAttribute("required", "required");
  }
  console.log(inputPassword.value);

})

createBtn.addEventListener("click", () => {
  createRoomBody.classList.add("d-none")
  createBtn.classList.add("d-none")
  createModal.classList.remove("d-none")
})

searchEl.addEventListener("click", () => {
  window.location.href = "../search"
})

cancelBtn.addEventListener("click", () => {
  createRoomBody.classList.remove("d-none")
  createModal.classList.add("d-none")
  createBtn.classList.remove("d-none")
})

fetchApi();