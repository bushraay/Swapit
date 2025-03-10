// const mongoose = require('mongoose');

// const SkillsSchema = new mongoose.Schema({
//     user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
//     // Skills_i_have: [
//     //     {
//     //         Skill: { type: String, required: true },
//     //         category: { type: String, required: true },
//     //     },
//     // ],
//     // Skills_i_want: [
//     //     {
//     //         Skill: { type: String, required: true },
//     //         category: { type: String, required: true },
//     //     },
//     // ],
//     Skills_i_have: { type: String, default: "" }, // Comma-separated skills
//     category_skills_i_have: { type: String, default: "" }, // Comma-separated categories

//     Skills_i_want: { type: String, default: "" }, // Comma-separated skills
//     category_skills_i_want: { type: String, default: "" }, // Comma-separated categorie
//     availability: { type: String, default: "" },
//     email: { type: String, required: true },
// }, { collection: 'Skills' });

// mongoose.model("Skills", SkillsSchema);
const mongoose = require('mongoose');

const SkillsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    // Skills_i_have: [
    //     {
    //         Skill: { type: String, required: true },
    //         category: { type: String, required: true },
    //     },
    // ],
    // Skills_i_want: [
    //     {
    //         Skill: { type: String, required: true },
    //         category: { type: String, required: true },
    //     },
    // ],
    Skills_i_have: { type: String, default: "" }, // Comma-separated skills
    category_skills_i_have: { type: String, default: "" }, // Comma-separated categories

    Skills_i_want: { type: String, default: "" }, // Comma-separated skills
    category_skills_i_want: { type: String, default: "" },
    availability: { type: String, default: "" },
    email: { type: String, required: true },
}, { collection: 'Skills' });

mongoose.model("Skills", SkillsSchema);