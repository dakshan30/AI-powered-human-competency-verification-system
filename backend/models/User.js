const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    // Name field kept for backward compatibility with legacy reports/dashboard
    name: {
      type: String,
      trim: true,
      default: function() {
        return this.username;
      }
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "recruiter", "manager", "candidate"],
      default: "recruiter"
    },

    permissions: [
      {
        type: String
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    },

    profileImage: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// pre-save Mongoose middleware hook that automatically hashes the password using bcryptjs (salt factor 10)
userSchema.pre("save", async function() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// instance method matchPassword(enteredPassword) safely comparing plain-text against the hash
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);