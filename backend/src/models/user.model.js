const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    passwordHash: {
      type: String,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.passwordHash;
    delete ret.resetPasswordToken;
    delete ret.emailVerificationToken;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);