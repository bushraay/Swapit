const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema({
    f_name: String,
    l_name: String,
    email: { type: String, unique: true },
    age: Number,
    university: String,
    username: { type: String, unique: true },
    password: { type: String, required: true },
    user_id: Number,
    user_name: String,
    gender: String,
    skills_i_want: String,
    skills_i_have: String,
    availability: String,
    image: String,
    reviews: [
        {
            reviewerEmail: String,
            rating: Number,
            comment: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { collection: "UserInfo" });

const UserInfo = mongoose.model("UserInfo", UserDetailSchema); 

module.exports = UserInfo; // ✅ Make sure this line exists