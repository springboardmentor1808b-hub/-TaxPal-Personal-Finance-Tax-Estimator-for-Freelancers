const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter valid email"],
      index: true,
    },

    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter valid phone number"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hide password by default
    },

    country: {
      type: String,
      required: true,
    },

    incomeBracket: {
      type: String,
      enum: ["low", "middle", "high"],
      default: "middle",
    },
  },
  { timestamps: true }
);


  // HASH PASSWORD BEFORE SAVE

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


 //  MATCH PASSWORD METHOD


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
