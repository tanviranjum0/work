// const display =document.getElementById('root')
function getData() {
  fetch("http://127.0.0.1:5500/myReact/localServerCheck/placeholder.json")
    .then((res) => res.json())
    .then(console.log);
}
