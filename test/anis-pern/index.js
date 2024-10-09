const express = require("express");
const uuid = require("uuid");
const pool = require("./db");
const app = express();

app.use(express.json({ urlencoded: true }));
// GET /book > return all books

app.get("/books", async (req, res) => {
  try {
    const books = await pool.query("SELECT * FROM book");

    res.status(200).json({ message: "Success", books });
  } catch (error) {
    res.json({ error: error.message });
  }
});

//POST /book/:id > return a specific book
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const { name, description } = req.body;
    const data = await pool.query("select * from book where id=$1", [id]);
    res.status(200).json({
      message: `Success Create for book with id: ${id} ,`,
      data,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});
//POST /books > create a book
app.post("/books", async (req, res) => {
  try {
    const { name, description } = await req.body;
    console.log(name, description);
    const id = uuid.v4();
    console.log(id);
    const data = await pool.query(
      "INSERT INTO book (id,name,description) VALUES ($1, $2, $3) RETURNING *",
      [id, name, description]
    );

    res
      .status(201)
      .json({ message: "Success Create", id, name, description, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//DELETE /books/:id > delete a book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `Success Delete for book with id: ${id}` });
  } catch (error) {
    res.json({ error: error.message });
  }
});
//PUT /books/:id > update a book
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `Success Update for book with id: ${id}` });
  } catch (error) {
    res.json({ error: error.message });
  }
});
app.listen(3000, () => console.log("listening on port 3000"));
