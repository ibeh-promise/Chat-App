console.log("Hi World!")
document.getElementById("form").addEventListener("submit", () => {
  if(location.reload){
console.log(`hi bro`);
fetch('https://02869a4d-306e-4253-9746-77098bf8355a-00-gvmdbk6ao948.kirk.replit.dev/register')
.then((res) => {
  if(res.status == 500 || res.status == 401){
    document.getElementById("message").textContent = "Username already taken"
    alert("used")
  }else{
    res.json()
  }
    })
  }
})