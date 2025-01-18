const mongoose = require("mongoose");

const SkillsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "UserInfo" },
  name: { type: String, required: true }, // User's name
  gender: { type: String },
  age: { type: Number },
  skills_i_have: { type: String, required: true },
  category_skills_i_have: { type: String, required: true },
  skills_i_want: { type: String },
  category_skills_i_want: { type: String },
  availability: { type: String },
  email: { type: String, required: true  },
}, {
  collection: "Skills"
});

mongoose.model("Skills", SkillsSchema);
