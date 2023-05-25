const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name:  { type: String, default: null},
  email: { type: String, default: true},
  password: { type: String },
  token: { type: String },
  active: { type: Boolean }
}, { versionKey: false })

const UserModel = mongoose.model('user', userSchema, 'user')

module.exports = UserModel
