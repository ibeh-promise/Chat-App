console.log("Hello World!")

// fetch('https://02869a4d-306e-4253-9746-77098bf8355a-00-gvmdbk6ao948.kirk.replit.dev/api')
// .then(res => res.json())
// .then(data => console.log(data))

async function api() {
  const response = await fetch('/api');
  const data = await response.json();
  console.log(data);
}

api()