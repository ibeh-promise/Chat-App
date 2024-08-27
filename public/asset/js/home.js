const dbName = document.getElementById("dbName");
const prompt = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const imageButton = document.getElementById("image-button");
const chatBody = document.getElementById("chat-body");
const form = document.getElementById("form");
const option = document.querySelector(".option");
const option2 = document.querySelector(".option2");
const deleteMsg = document.getElementById("delete-msg");
const deleteMsg2 = document.getElementById("delete-msg2");
const copyMsg = document.getElementById("copy-msg");
const backBtn = document.getElementById("back-btn");
let username;
let inputName;
let msgArr = [];
let nameArr = [];
let cta;
let imageData;
let tname

const socket = io();
console.log("opt " + option);
function fetchApi() {
  fetch("/home/api/")
    .then((res) => res.json())
    .then((data) => {
      data.data.map((item) => {
        console.log("results ", item); 
        username = item.name
      })
        data.chatData.map((item) => {
          imageData = item.image;
          tname = item.tablename;
          console.log("imageData " , item);
          // username = item.name;
          dbName.textContent = item.tablename;
          if (!item.message) {
            const p = document.createElement("p");
            p.innerHTML = `<p class="text-center text-secondary">Welcome to the chat ${item.tablename}</p>`;
            chatBody.appendChild(p);
          } else {
            let row = document.createElement("div");
            if (item.isblob == "true") {
              if (item.name == username) {
                let div = document.createElement("div");
                div.classList.add("d-flex", "w-100", "justify-content-end");
                
                row.appendChild(div);
                let div2 = document.createElement("div");
                div2.classList.add("cards");
                div.appendChild(div2);
                let small = document.createElement("small")
                  small.classList.add("fs-8", "card-title", "text-warning");
                
                small.textContent = "you";
                div2.appendChild(small);
                let img = document.createElement("img");
                img.classList.add("img-setting", "w-100", "d-block", "m-auto");
                img.src = `../uploads/${item.message}`;
                div2.appendChild(img);
                img.addEventListener("dblclick", (e) => {
                  console.log("img");
                  div2.style.outline = "solid blue 1px";
                  option.style.display = "flex";
                  document.body.addEventListener("click", () => {
                    option.style.display = "none";
                    div2.style.outline = "none";
                  });
                  deleteMsg.addEventListener("click", () => {
                    console.log("img", e.target.src);
                    const message = e.target.src.split("/")[4];
                    socket.emit("delete", message);
                    div.remove();
                  });
                });
              } else {
                let div = document.createElement("div");
                div.classList.add("d-flex", "w-100", "justify-content-start");
                row.appendChild(div);
                let div2 = document.createElement("div");
                div2.classList.add("cards2");
                div.appendChild(div2);
                let small = document.createElement("small");
                small.classList.add("fs-8", "card-title", "text-warning");
                small.textContent = item.name;
                div2.appendChild(small);
                let img = document.createElement("img");
                img.classList.add("img-setting", "w-100", "d-block", "m-auto");
                
                img.src = `../uploads/${item.message}`;
                div2.appendChild(img);

                img.addEventListener("dblclick", (e) => {
                  console.log("img");
                  div2.style.outline = "solid blue 1px";
                  option.style.display = "flex";
                  document.body.addEventListener("click", () => {
                    option.style.display = "none";
                    div2.style.outline = "none";
                  });
                  deleteMsg.addEventListener("click", () => {
                    console.log("img", e.target.src);
                    const message = e.target.src.split("/")[4];
                    console.log("msg " + message);
                    socket.emit("delete", message);
                    div.remove();
                  });
                });
                
              }
              chatBody.appendChild(row);

              console.log(row);
            } else {
              let row = document.createElement("div");
              row.classList.add("row");
              if (item.name == username) {
                let div = document.createElement("div");
                div.classList.add("d-flex", "w-100", "justify-content-end");
                
                row.appendChild(div);
                let div2 = document.createElement("div");
                div2.classList.add("cards");
                div.appendChild(div2);
                let small = document.createElement("small");
                small.classList.add("fs-8", "card-title", "text-warning");
                
                small.textContent = "you";
                div2.appendChild(small);
                let p = document.createElement("p");
                p.classList.add("fs-12", "card-title");
                p.textContent = item.message;
                div2.appendChild(p);

                p.addEventListener("dblclick", (e) => {                 
                  div2.style.outline = "solid blue 1px";
                  option2.style.display = "flex";
                  document.body.addEventListener("click", () => {
                    option2.style.display = "none";
                    div2.style.outline = "none";
                  });
                  deleteMsg2.addEventListener("click", () => {
                   socket.emit("delete", item.message);
                    div.remove();
                  });
                  copyMsg.addEventListener("click", () => {
                    navigator.clipboard.writeText(e.target.textContent);
                  })
                });
                
              } else {
                  let div = document.createElement("div");
                  div.classList.add("d-flex", "w-100", "justify-content-start");
                  row.appendChild(div);
                  let div2 = document.createElement("div");
                  div2.classList.add("cards2");
                  div.appendChild(div2);
                  let small = document.createElement("small")
                    small.classList.add("fs-8", "card-title", "text-warning");
                  
                  small.textContent = item.name;
                  div2.appendChild(small);
                  let p = document.createElement("p");
                  p.classList.add("fs-12", "card-title");
                  p.textContent = item.message;
                  div2.appendChild(p);

                  p.addEventListener("dblclick", (e) => {
                    div2.style.outline = "solid blue 1px";
                    option2.style.display = "flex";
                    document.body.addEventListener("click", () => {
                      option2.style.display = "none";
                      div2.style.outline = "none";
                    });
                    deleteMsg2.addEventListener("click", () => {          
                      socket.emit("delete", item.message);
                      div.remove();
                    });
                    copyMsg.addEventListener("click", () => {
                      navigator.clipboard.writeText(e.target.textContent);
                    })
                  });
              }
              chatBody.appendChild(row);

              function scroll() {
                chatBody.lastElementChild.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              }
              setTimeout(scroll, 400);
            }
          }
        });
      
    })
    .catch((e) => {
      console.log("error", e);
      location.href = "../login";
    });
}

imageButton.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.name = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      imageData = e.target.result;
      console.log("img ", imageData);
      filename = file.name;
      socket.emit("image", username, imageData, filename, tname);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  });
  fileInput.click();
});

backBtn.addEventListener("click", () => {
  window.location.href = "../home";
})

prompt.addEventListener("input", () => {
  if (!prompt.value) {
    sendButton.style.display = "none";
  } else if (prompt.value == " ") {
    sendButton.style.display = "none";
  } else {
    sendButton.style.display = "block";
  }
});
sendButton.addEventListener("click", () => {
  sendButton.style.display = "none";
  inputName = prompt.value;
  console.log(inputName + "2");
});

form.addEventListener("submit", (e) => {
  if (prompt.value) {
    e.preventDefault();
    //socket.emit("name", username)
    console.log("inputName " + inputName);
    socket.emit("chat", username, prompt.value, tname);
    inputName = prompt.value;
    prompt.value = "";
  } else {
    sendButton.style.display = none;
  }
});

socket.on("chat", (name, msg) => {
  let row = document.createElement("div");
  row.classList.add("row");
  if (name == username) {
    let div = document.createElement("div");
    div.classList.add("d-flex", "w-100", "justify-content-end");
    row.appendChild(div);
    let div2 = document.createElement("div");
    div2.classList.add("cards");
    div.appendChild(div2);
    let small = document.createElement("small");
    small.classList.add("fs-8", "card-title", "text-warning");
    small.textContent = "you";
    div2.appendChild(small);
    let p = document.createElement("p");
    p.classList.add("fs-12", "card-title");
    p.textContent = msg;
    div2.appendChild(p);

    p.addEventListener("dblclick", (e) => {
      div2.style.outline = "solid blue 1px";
      option2.style.display = "flex";
      document.body.addEventListener("click", () => {
        option2.style.display = "none";
        div2.style.outline = "none";
      });
      deleteMsg2.addEventListener("click", () => {
        socket.emit("delete", msg);
        div.remove();
      });
      copyMsg.addEventListener("click", () => {
        navigator.clipboard.writeText(e.target.textContent);
      })
    });
  } else {
      let div = document.createElement("div");
      div.classList.add("d-flex", "w-100", "justify-content-start");
      row.appendChild(div);
      let div2 = document.createElement("div");
      div2.classList.add("cards2");
      div.appendChild(div2);
      let small = document.createElement("small");
      small.classList.add("fs-8", "card-title", "text-warning");
      small.textContent = name;
      div2.appendChild(small);
      let p = document.createElement("p");
      p.classList.add("fs-12", "card-title");      
      p.textContent = msg;
      div2.appendChild(p);

      p.addEventListener("dblclick", (e) => {
        div2.style.outline = "solid blue 1px";
        option2.style.display = "flex";
        document.body.addEventListener("click", () => {
          option2.style.display = "none";
          div2.style.outline = "none";
        });
        deleteMsg2.addEventListener("click", () => {      
          socket.emit("delete", msg);
          div.remove();
        });
        copyMsg.addEventListener("click", () => {
          navigator.clipboard.writeText(e.target.textContent);
        })
      });
    // 
  }
  chatBody.appendChild(row);
  function scroll() {
    chatBody.lastElementChild.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
  setTimeout(scroll, 10)
});

socket.on("image", (name, image, filename) => {
  
  console.log("filenamep " + filename);
  let row = document.createElement("div");
  row.classList.add("row");
  if (name == username) {
    let div = document.createElement("div");
    div.classList.add("d-flex" , "w-100", "justify-content-end");
    row.appendChild(div);
    let div2 = document.createElement("div");
    div2.classList.add("cards");
    div.appendChild(div2);
    let small = document.createElement("small");
    small.classList.add("fs-8", "card-title", "text-warning");
    small.textContent = "you";
    div2.appendChild(small);
    let img = document.createElement("img");
    img.classList.add("img-setting", "w-100", "d-block", "m-auto");
    img.src = `${image}`;
    div2.appendChild(img);

    img.addEventListener("dblclick", (e) => {
      console.log("img");
      div2.style.outline = "solid blue 1px";
      option.style.display = "flex";
      document.body.addEventListener("click", () => {
        option.style.display = "none";
        div2.style.outline = "none";
      });
      deleteMsg.addEventListener("click", () => {
        console.log("img", e.target.src);
        const message = filename
        socket.emit("delete", message);
        div.remove();
      });
      
    });
  } else {
    let div = document.createElement("div");
    div.classList.add("d-flex", "w-100", "justify-content-start");
    row.appendChild(div);
    let div2 = document.createElement("div");
    div2.classList.add("cards2");
    div.appendChild(div2);
    let small = document.createElement("small");
    small.classList.add("fs-8", "card-title", "text-warning");
    small.textContent = name
    div2.appendChild(small);
    let img = document.createElement("img");
    img.classList.add("img-setting", "w-100", "d-block", "m-auto");
    img.src = `${image}`;
    div2.appendChild(img);

    img.addEventListener("dblclick", (e) => {
      console.log("img");
      div2.style.outline = "solid blue 1px";
      option2.style.display = "flex";
      document.body.addEventListener("click", () => {
        option2.style.display = "none";
        div2.style.outline = "none";
      });
      deleteMsg.addEventListener("click", () => {
        console.log("img", e.target.src);
        const message = filename
        console.log("msg " + message);
        socket.emit("delete", message);
        div.remove();
      });
    });
  }
  chatBody.appendChild(row);
  function scroll() {
    chatBody.lastElementChild.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
  setTimeout(scroll, 50)
});

fetchApi();
