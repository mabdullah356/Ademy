const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "name have at least 3 Characters"],
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        minlength: [8, "Password have at least 8 Characters"],
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "instructor", "admin"]
    },
    avatar: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        require: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    isOAuthUser: {
        type: Boolean,
        default: false
    }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;