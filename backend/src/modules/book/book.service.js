const Book = require("./book.model");
const mongoose = require("mongoose");

exports.addBook = async (userId, data) => {
  const allowedFields = ["title", "author", "condition", "exchangeType", "description", "images"];

  const filteredData = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) filteredData[field] = data[field];
  });

  const exists = await Book.findOne({
    owner: userId,
    title: filteredData.title,
  });

  if (exists) throw new Error("Book already exists");

  return await Book.create({ ...filteredData, owner: userId });
};

exports.getUserBooks = async (userId) => {
  return await Book.find({ owner: userId });
};

exports.getAllBooks = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  return await Book.find({ status: "available" })
    .populate("owner", "name")
    .skip(skip)
    .limit(limit);
};

exports.getBookById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid book ID");
  }

  return await Book.findById(id).populate("owner", "name");
};

exports.updateBook = async (userId, bookId, data, images) => {
  const book = await Book.findOne({ _id: bookId, owner: userId });

  if (!book) throw new Error("Book not found or unauthorized");
  if (book.status !== "available") throw new Error("Book cannot be modified");

  const allowedUpdates = ["title", "author", "condition", "exchangeType", "description"];

  allowedUpdates.forEach((field) => {
    if (data[field] !== undefined) {
      book[field] = data[field];
    }
  });

  if (images?.length) {
    book.images = [...book.images, ...images];
  }

  return await book.save();
};

exports.deleteBook = async (userId, bookId) => {
  const book = await Book.findOne({ _id: bookId, owner: userId });

  if (!book) throw new Error("Book not found or unauthorized");
  if (book.status !== "available") throw new Error("Book cannot be deleted");

  await book.deleteOne();

  return { message: "Book deleted successfully" };
};