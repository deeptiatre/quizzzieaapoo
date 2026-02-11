const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student'
    }
  },
  { timestamps: true }
);





userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hashedPass = await bcrypt.hash(this.password, 10);
  this.password = hashedPass;
});



userSchema.methods.comparePass = async function (password) {
  let comparePass = await bcrypt.compare(password, this.password);
  return comparePass;
};


module.exports = mongoose.model('User', userSchema);
