const service = require("./book.service");

exports.addBook = async (req, res) => {
  try {
    const { title, author, condition, exchangeType } = req.body;

    if (!title || !author || !condition) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const images = req.files?.map((f) => f.path) || [];

    const book = await service.addBook(req.user._id, {
      title,
      author,
      condition,
      exchangeType,
      description: req.body.description,
      images,
    });

    res.status(201).json(book);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.getMyBooks = async (req, res) => {
  try {
    const books = await service.getUserBooks(req.user._id);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await service.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await service.getBookById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const images = req.files?.map((f) => f.path) || null;

    const book = await service.updateBook(
      req.user._id,
      req.params.id,
      req.body,
      images
    );

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await service.deleteBook(req.user._id, req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};