
const dbName = document.getElementById("dbName");
const prompt = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
console.log("Hello World!");
const chatBody = document.getElementById("chat-body");
let itemName = null;

// fetch(
//   "https://02869a4d-306e-4253-9746-77098bf8355a-00-gvmdbk6ao948.kirk.replit.dev/test",
// )
//   .then((res) => res.json())
//   .then((data) => {
//     console.log(data);
//     resultData = data.loginData.map((item) => {
//       itemName = item.name;
//       dbName.textContent = item.name;
//     })

//     localStorage.setItem("token", data.token);

//   });

// Assume you have a function to send a login request to the server
const login = async () => {
  try {
    const response = await fetch('https://02869a4d-306e-4253-9746-77098bf8355a-00-gvmdbk6ao948.kirk.replit.dev/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Assuming the server responds with a token in the data object
    data.loginData.map((item) => {
    itemName = item.name;
    dbName.textContent = item.name;
    // Store the token securely (example using sessionStorage)
    localStorage.setItem('token', token);

    window.location.href = '/home';
    })
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example usage of the login function
login();


// Function to make authenticated requests
//const fetchData = async () => {
  // try {
  //   // Get the token from sessionStorage
  //   const storedToken = localStorage.getItem("token");

  //   if (!storedToken) {
  //     // Handle case where token is not available
  //     console.error("Token not found");
  //     return;
  //   }
  //   const headers = {
  //     Authorization: `Bearer ${storedToken}`,
  //     'Content-Type': 'application/json',
  //   };

  //   // Make a request using fetch or axios with the Authorization header
  //   const response = await fetch('https://02869a4d-306e-4253-9746-77098bf8355a-00-gvmdbk6ao948.kirk.replit.dev/chat/api', {
  //     method: 'GET',
  //     headers,
  //   });

  //   if (!response.ok) {
  //     // Handle non-successful response
  //     throw new Error('Network response was not ok');
  //   }

    const data = await response.json();
    // Handle the response data
    console.log(data);
    let rows = data.data;
    rows.map((val) => {
      let row = document.createElement("div");
      row.classList.add("row");
      if (val.chat_id == itemName) {
        row.innerHTML = 
        `
        <div class="cards" >

            <small class="card-title fs-8 text-warning">${val.chat_id}</small>
              <p class="card-title fs-12">${val.name}</p>

        </div>
      `;
      } else {
        row.innerHTML =`
        <div class="cards2">
            <small class="card-title fs-8 text-primary">${val.chat_id}</small>
              <p class="card-title fs-12">${val.name}</p>

        </div>
      `;
      }
      console.log(row);
      chatBody.appendChild(row);
      if (location.reload){
        chatBody.scrollTop = chatBody.scrollHeight;
       }
    })

fetch(
"https://02869a4d-306e-4253-9746-77098bf8355a-00-gvmdbk6ao948.kirk.replit.dev/chat/api", {
  headers: {
  'Authorization': `Bearer ${localStorageToken}`,
  'Content-Type': 'application/json'
}
}
)
.then((res) => res.json())
.then((data) => {
  console.log(data);
  let rows = data.data;
  rows.map((val) => {
    let row = document.createElement("div");
    row.classList.add("row");
    if (val.chat_id == itemName) {
      row.innerHTML = 
      `
      <div class="cards" >

          <small class="card-title fs-8 text-warning">${val.chat_id}</small>
            <p class="card-title fs-12">${val.name}</p>

      </div>
    `;
    } else {
      row.innerHTML =`
      <div class="cards2">
          <small class="card-title fs-8 text-primary">${val.chat_id}</small>
            <p class="card-title fs-12">${val.name}</p>

      </div>
    `;
    }
    console.log(row);
    chatBody.appendChild(row);
    if (location.reload){
      chatBody.scrollTop = chatBody.scrollHeight;
     }
  });
});
