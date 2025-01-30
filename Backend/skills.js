const mongoose = require('mongoose');

const SkillsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    skills_i_have: [
        {
            skill: { type: String, required: true },
            category: { type: String, required: true },
        },
    ],
    skills_i_want: [
        {
            skill: { type: String, required: true },
            category: { type: String, required: true },
        },
    ],
    availability: { type: String, default: "" },
    email: { type: String, required: true },
});

mongoose.model("Skills", SkillsSchema);
