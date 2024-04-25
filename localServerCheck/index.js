function getData() {
  fetch("./placeholder.json")
    .then((res) => res.json())
    .then(console.log);
}
