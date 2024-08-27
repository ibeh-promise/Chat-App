const email = document.getElementById("email").value
const password = document.getElementById("password").value
console.log(email,password);

document.getElementById("form").addEventListener("submit", function (event) {
   // event.preventDefault();
    fetch("/login", {
      body: JSON.stringify({
        email, 
        password 
    }),
    method: "POST",
    }
         )
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          document.getElementById("message").textContent =
            "Logged in successfully!";
          console.log(response);
        } else if (response.status === 401 || response.status === 500) {
          document.getElementById("message").textContent = "Invalid email or password.";
        } else {
          document.getElementById("message").textContent =
            "An error occurred. Please try again later.";
        }
        response.json();
        console.log(response);
        
      })
      .then((data) => console.log(`data: ${data}`))
      .catch((error) => {
        console.error("Error:", error);
        alert("Error: " + error.message);
        document.getElementById("message").textContent =
          "An error occurred. Please try again later.";
      });
});
