// schema is going to define what kind of value our detail would carry

const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema({
    f_name: String,
    l_name: String,
    email: {type: String, unique: true},
    age: Number,
    university: String,
    username: { type: String, unique: true },
    password: { type: String, required: true },
    // re_password: String,

},{
    collection: "UserInfo"

});
mongoose.model("UserInfo", UserDetailSchema);