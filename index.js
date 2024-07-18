let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.port || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: "./books_database.sqlite",
    driver: sqlite3.Database,
  });
})();

async function getAllBooks() {
  let query = "SELECT * FROM books";
  let response = await db.all(query, []);
  return { books: response };
}

app.get("/books", async (req, res) => {
  try {
    let result = await getAllBooks();

    if (result.books.length === 0) {
      res.status(404).json({ message: "No Books Found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getAllBooksByAuthor(author) {
  let query = "SELECT * FROM books WHERE author = ?";
  let response = await db.all(query, [author]);
  return { books: response };
}

app.get("/books/author/:author", async (req, res) => {
  try {
    let author = req.params.author;
    let result = await getAllBooksByAuthor(author);

    if (result.books.length === 0) {
      res.status(404).json({ message: "No Books Found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getAllBooksByGenre(genre) {
  let query = "SELECT * FROM books WHERE genre = ?";
  let response = await db.all(query, [genre]);
  return { books: response };
}

app.get("/books/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await getAllBooksByGenre(genre);
    if (result.books.length === 0) {
      res.status(404).json({ message: "No Books Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getAllBooksByPublicationYear(year) {
  let query = "SELECT * FROM books WHERE publication_year = ?";
  let response = await db.all(query, [year]);
  return { books: response };
}

app.get("/books/publication_year/:year", async (req, res) => {
  try {
    let year = req.params.year;
    let result = await getAllBooksByPublicationYear(year);
    if (result.books.length === 0) {
      res.status(404).json({ message: "No Book Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log("Server running on port 3000"));
