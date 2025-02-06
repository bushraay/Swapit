const mongoose = require('mongoose');

// MongoDB connection string
const mongoUri = 'mongodb+srv://ayesha:dRhXznyyTNous7EC@cluster0.af1kc.mongodb.net/SwapIt?retryWrites=true&w=majority';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Define UserInfo model
const UserInfoSchema = new mongoose.Schema({
    f_name: String,
    l_name: String,
    email: { type: String, unique: true },
    age: Number,
    university: String,
    user_name: { type: String, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('UserInfo', UserInfoSchema); // Register UserInfo model

// Define Skills model
const SkillsSchema = new mongoose.Schema({
    UserID: Number,
    Name: String,
    Gender: String,
    Age: Number,
    SkillsIWant: String,
    SkillsIHave: String,
    Availability: String,
    Image: String,
});

const Skills = mongoose.model('Skills', SkillsSchema); // Register Skills model

// Define MergedUser model
const MergedUserSchema = new mongoose.Schema({
    user_id: Number,
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

const MergedUser = mongoose.model('MergedUser', MergedUserSchema); // Register MergedUser model

// Function to merge collections
const mergeCollections = async () => {
    try {
        const users = await User.find({});
        const skills = await Skills.find({});

        for (const user of users) {
            const userSkills = skills.filter(skill => skill.Name === user.f_name);
            for (const skill of userSkills) {
                const mergedUser = new MergedUser({
                    user_id: skill.UserID,
                    f_name: user.f_name,
                    l_name: user.l_name,
                    email: user.email,
                    age: user.age,
                    university: user.university,
                    user_name: user.user_name,
                    gender: skill.Gender,
                    skills_i_want: skill.SkillsIWant,
                    skills_i_have: skill.SkillsIHave,
                    availability: skill.Availability,
                    image: skill.Image,
                });
                await mergedUser.save();
            }
        }

        console.log("Merging complete!");
    } catch (error) {
        console.error("Error merging collections:", error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the merge function
mergeCollections();
