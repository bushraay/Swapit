const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const items = require('./items');
const router = express.Router();
// const Item = require('./item');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoUri = 'mongodb+srv://ayesha:dRhXznyyTNous7EC@cluster0.af1kc.mongodb.net/SwapIt?retryWrites=true&w=majority';
mongoose.connect(mongoUri)
   .then(() => console.log('MongoDB connected...'))
   .catch(err => console.log(err));

require('./UserDetail');
require('./skills');

const User = mongoose.model("UserInfo");
const Skills = mongoose.model("Skills");
const JWT_SECRET = "hdidjnfbjsakjdhdiksmnhcujiksjieowpqlaskjdsolwopqpowidjxmmxm";

// Root route
app.get("/", (req, res) => {
   res.status(200).json({ message: "Root route is working!" });
});
app.post('/check-email', async (req, res) => {
   try {
     const { email } = req.body;
     const user = await User.findOne({ email });
     res.json({ exists: !!user });
   } catch (error) {
     console.error("Error checking email:", error);
     res.status(500).json({ error: "Internal server error" });
   }
 });
 let nextUserId = 600;

// Create account
app.post('/CreateAccount', async (req, res) => {
   try {
      const { f_name, l_name, email, age, university, user_name, password, user_id } = req.body;

      const oldUser = await User.findOne({ email });
      if (oldUser) {
         return res.status(400).json({ message: "User already exists" });
      }
      const encryptedPassword = await bcrypt.hash(password, 10);
      const userId = nextUserId;
      nextUserId++;
      console.log("userId", userId);
      console.log("next user",nextUserId);
      
      const newUser = await User.create({
         f_name,
         l_name,
         email,
         age,
         university,
         user_name,
         password: encryptedPassword,
         // user_id: userId,
      });
      // console.log("userId", user_id);
      res.status(201).json({ message: "User created successfully", data: newUser });
   } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error", error });
   }
});

// Add skills
app.post("/AddSkills", async (req, res) => {
   try {
      const { email, name, age, skills_i_have, category_skills_i_have } = req.body;
      console.log("1");
      

      if (!email || !skills_i_have || !category_skills_i_have) {
         return res.status(400).json({ message: "Missing required fields." });
      }

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({ message: "User not found." });
      }
      console.log("2");

      const newSkill = await Skills.create({
         // user_id: user._id,
         name,
         age,
         skills_i_have,
         category_skills_i_have,
         skills_i_want: req.body.skills_i_want || "",
         category_skills_i_want: req.body.category_skills_i_want || "",
         availability: req.body.availability || "",
         email: user.email, 
      });
      console.log("3");

      res.status(201).json({ message: "Skills added successfully", data: newSkill });
      console.log("2");
   } catch (error) {
      console.log("4");
      console.error("Error adding skills:", error);
      console.log("6");
      res.status(500).json({ message: "Internal server error" });
      console.log("");
   }
});




// Fetch User Data from Both Collections
// app.get('/GetUserData', async (req, res) => {
//    const { email } = req.query;

//    if (!email) {
//        return res.status(400).json({ message: "Email is required" });
//    }

//    try {
//        // Find the user based on the provided email
//        const user = await User.findOne({ email });
//        if (!user) {
//            return res.status(404).json({ message: "User not found" });
//        }

//        // Generate full name for matching
//        const fullName = `${user.f_name.trim()} ${user.l_name.trim()}`;
//        console.log("Generated fullName:", fullName);

//        // Debugging: Fetch all skills and map the names
//        const skillsDataList = await Skills.find(); // Resolve the Promise
//        console.log(skillsDataList);
//        const skillsDatas = await Skills.findOne({ name: fullName });
//        console.log(skillsData);
       
       
//        const skillsList = skillsDataList.map(skill => skill.name.trim().toLowerCase()); // Map to lowercase names
//        console.log("All Skills names:", skillsList);

//        if (!skillsList.includes(fullName.toLowerCase())) {
//            console.error("No match found for the fullName in Skills collection.");
//            return res.status(404).json({
//                message: "Skills data not found for user.",
//                fullName: fullName
//            });
//        }

//        // Find the matching skills entry using case-insensitive matching
//        const skillsData = await Skills.findOne({
//            name: { $regex: `^${fullName}$`, $options: "i" }
//        });

//        if (!skillsData) {
//            console.error("Skills not found for:", fullName);
//            return res.status(404).json({
//                message: "Skills data not found for user.",
//                fullName: fullName
//            });
//        }

//        // Return combined data from both collections
//        res.status(200).json({
//            name: user.user_name,
//            university: user.university,
//            availability: skillsData.availability || "Not Available",
//            skills: skillsData.skills_i_have || [],
//            learning: skillsData.skills_i_want || [],
//            reviews: ["Great mentor!", "Very helpful!"]
//        });
//    } catch (error) {
//        console.error("Error fetching user data:", error);
//        res.status(500).json({ message: "Error fetching user data." });
//    }
// });



// Login
app.post('/Login', async (req, res) => {
   try {
      const { email, password } = req.body;

      const oldUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }); 

      if (!oldUser) {
         return res.status(404).json({ message: "User doesn't exist" });
      }

      const isPasswordValid = await bcrypt.compare(password, oldUser.password);
      if (!isPasswordValid) {
         return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign({ email: oldUser.email }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ status: 'Ok', data: token });
   } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
   }
});

// Fetch user data
app.post('/userdata', async (req, res) => {
   const { token } = req.body;
   try {
      const user = jwt.verify(token, JWT_SECRET);
      const useremail = user.email;

      User.findOne({ email: useremail }).then((data) => {
         return res.send({ status: "Ok", data: data });
      });
   } catch (error) {
      return res.send({ error: "error" });
   }
});

// Fetch recommended tutors
app.get("/recommendedTutors", async (req, res) => {
  try {
     // Use default values to handle undefined query parameters
     const skillsToLearn = req.query.skillsToLearn ? req.query.skillsToLearn.split(",") : [];
     const skillsIHave = req.query.skillsIHave ? req.query.skillsIHave.split(",") : [];

     const tutors = await Skills.find();
     const sortedTutors = tutors.sort((a, b) => {
        const aScore =
           (skillsToLearn.includes(a["Skills I Have"]) ? 2 : 0) +
           (skillsIHave.includes(a["Skills I Want"]) ? 1 : 0);
        const bScore =
           (skillsToLearn.includes(b["Skills I Have"]) ? 2 : 0) +
           (skillsIHave.includes(b["Skills I Want"]) ? 1 : 0);
        return bScore - aScore;
     });

     // Limit the results to the top 10 tutors
     const limitedTutors = sortedTutors.slice(0, 500);

     res.status(200).json({ status: "Ok", data: limitedTutors });
  } catch (error) {
     console.error("Error fetching tutors:", error);
     res.status(500).json({ message: "Internal server error" });
  }
});




// Fetch recommended skills
app.get('/recommendedSkills', async (req, res) => {
  try {
    const { search } = req.query;

    // Build a dynamic search filter
    const filter = {};
    if (search) {
      filter["Skills I Want"] = { $regex: search, $options: "i" }; // Case-insensitive regex search
    }

    const skills = await Skills.find(filter, { 
      "Skills I Want": 1, 
      "Category (Skills I Want)": 1,
      "image": 1, 
      _id: 0 
    }).limit(10);

    res.status(200).json({ status: 'Ok', data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Fetch tutor profile
router.get('/tutorProfile/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const skillsData = await Skills.findOne({ tutorId: id });
      const userInfo = await User.findOne({ tutorId: id });

      if (!skillsData || !userInfo) {
         return res.status(404).json({ message: 'Tutor not found' });
      }

      res.json({
         name: userInfo.name,
         university: userInfo.university,
         availability: skillsData.availability,
         skills: skillsData.skills,
         learn: skillsData.learn,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
   }
});

// Fetch recommended items
app.get('/recommendedItems', async (req, res) => {
   try {
      const RItems = await items.find({}, {
         PersonName: 1,
         ItemName: 1,
         Category: 1,
         Condition: 1,
         Description: 1,
         Image: 1
      });

      res.status(200).json({ status: 'Ok', data: RItems });
   } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
});

// Update your server endpoint to handle search
app.get('/searchItems', async (req, res) => {
   try {
     const { query } = req.query;
     if (!query) {
       return res.status(400).json({ message: 'Search query is required' });
     }
 
     const searchTerms = query.toLowerCase().split(' ');
     
     const Items = await items.find({
       $or: [
         { ItemName: { $regex: searchTerms.join('|'), $options: 'i' } },
         { PersonName: { $regex: searchTerms.join('|'), $options: 'i' } },
         { Category: { $regex: searchTerms.join('|'), $options: 'i' } },
         { Condition: { $regex: searchTerms.join('|'), $options: 'i' } },
         { Description: { $regex: searchTerms.join('|'), $options: 'i' } }
       ]
     });
 
     res.status(200).json({ status: 'Ok', data: Items });
   } catch (error) {
     console.error('Error searching items:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 });


// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

// API test endpoint
app.get('/api/test', (req, res) => {
   res.json({ message: 'API is connected!' });
});