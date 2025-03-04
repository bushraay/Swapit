const mongoose = require('mongoose');
const UserDetailSchema = new mongoose.Schema({
    f_name: String,
    l_name: String,
    email: { type: String, unique: true },
    age: Number,
    university: String,
    username: { type: String, unique: true },
    password: { type: String, required: true },
    user_id: { type: Number, unique: true },  // Make sure this exists
    gender: String
}, {
    collection: "UserInfo"
});

mongoose.model("UserInfo", UserDetailSchema);
