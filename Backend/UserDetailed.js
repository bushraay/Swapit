const mongoose = require('mongoose');

const MergedUserSchema = new mongoose.Schema({
    user_id: Number, // From Skills collection
    f_name: String,
    l_name: String,
    email: String,
    age: Number,
    university: String,
    user_name: String,
    gender: String,
    skills_i_want: String,
    skills_i_have: String,
    availability: String,
    image: String,
}, { collection: 'MergedCollection' });

mongoose.model('MergedUser', MergedUserSchema);


