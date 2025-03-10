const mongoose = require('mongoose');
const MergedUserSchema = new mongoose.Schema({
    user_id: Number,
    f_name: String,
    l_name: String,
    gender: String,
    age: Number,
    skills_i_want: { type: String },  // Change from String to Array
    category_skills_i_want: String,
    skills_i_have: { type: String },  // Change from String to Array
    category_skills_i_have: String,
    availability: String,
    email: String,
    university: String,
    username: String,
    image: String,
}, { collection: 'MergedCollection' });

mongoose.model('MergedUser', MergedUserSchema);

