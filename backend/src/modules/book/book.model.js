const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    condition: {
      type: String,
      enum: ["new", "used"],
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: [(arr) => arr.length > 0, "At least one image required"],
    },
    exchangeType: {
      type: String,
      enum: ["book", "book+cash"],
      default: "book",
    },
    status: {
      type: String,
      enum: ["available", "locked", "exchanged"],
      default: "available",
    },
  },
  { timestamps: true },
);

bookSchema.index({ owner: 1 });
bookSchema.index({ status: 1 });

bookSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

bookSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Book", bookSchema);
