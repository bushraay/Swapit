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
require('./UserDetailed');

const User = mongoose.model("UserInfo");
const Skills = mongoose.model("Skills");
const MergedUser = mongoose.model( "MergedUser");

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


//  let nextUserId = 600;
// app.get('/getUserProfile', async (req, res) => {
//    try {
//       const { user_id } = req.query;

//       if (!user_id) {
//          return res.status(400).json({ message: "first name is required" });
//       }

//       // Find the user in the database using email_y
//       const user = await UserDetailed.findOne({ user_id });

//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }

//       res.status(200).json({
//          status: "Ok",
//          data: {
//             user_id: user.user_id,
//             f_name: user.f_name,
//             l_name: user.l_name,
//             email: user.email_y,  // Fixing email field
//             age: user.age,
//             university: user.university,
//             user_name: user.user_name || "Not Set", // Handle undefined
//             gender: user.gender || "Not Specified",
//             skills_i_have: user.skills_i_have || "Not Set",
//             skills_i_want: user.skills_i_want || "Not Set",
//             availability: user.availability || "Not Set",
//             image: user.image || "No Image"
//          }
//       });

//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });

// API to get user by email
app.get('/getUserProfileByEmail', async (req, res) => {
   try {
      const { email } = req.query;

      if (!email) {
         return res.status(400).json({ message: "Email is required" });
      }

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
         status: "Ok",
         data: user
      });

   } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
   }
});


// bipartite

// Function to perform bipartite matching
const bipartiteMatch = (users) => {
   let matches = [];
 
   users.forEach((user1) => {
     const [skillsHave, skillsWant] = user1.skills;
 
     users.forEach((user2) => {
       if (user1.user_id !== user2.user_id) {
         const [skillsHave2, skillsWant2] = user2.skills;
         
         // If user1 wants skill that user2 has, it's a match
         if (skillsWant.some(skill => skillsHave2.includes(skill)) && skillsWant2.some(skill => skillsHave.includes(skill))) {
           matches.push({ user1: user1.user_id, user2: user2.user_id });
         }
       }
     });
   });
 
   return matches;
 };
 
 // Endpoint to fetch user preferences and apply bipartite matching
 app.get("/userPreferences", async (req, res) => {
   try {
     const users = await MergedUser.find();
     const userPreferences = users.map((user) => {
       const skillsHave = user.skills_i_have ? user.skills_i_have.split(',') : [];
       const skillsWant = user.skills_i_want ? user.skills_i_want.split(',') : [];
       
       return {
         user_id: user.user_id,
         skills: [skillsHave, skillsWant]
       };
     });
 
     const matches = bipartiteMatch(userPreferences);
     res.json({ userPreferences, matches });
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
 });
 

// //user id se
// app.get('/getUserProfile', async (req, res) => {
//    try {
//       const { user_id } = req.query;

//       if (!user_id ) {
//          return res.status(400).json({ message: "User ID is required" });
//       }

//       const user = await MergedUser.findOne({user_id});
      
//       // Search by user_id if provided, otherwise search by email
      

//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }

//       res.status(200).json({
//          status: "Ok",
//          data: user
//       });

//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });



//  app.get('/getUserProfile', async (req, res) => {
//    try {
//       const { email } = req.query;

//       if (!email) {
//          return res.status(400).json({ message: "Email is required" });
//       }

//       // Find the user in the database
//       const user = await UserDetailed.findOne({ email });

//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }

      
//       res.status(200).json({
//          status: "Ok",
//          data: {
//             f_name: user.f_name,
//             l_name: user.l_name,
//             email: user.email,
//             age: user.age,
//             university: user.university,
//             user_name: user.user_name,
//             skills_i_have: skills ? skills.skills_i_have : [],
//             skills_i_want: skills ? skills.skills_i_want : [],
//             availability: skills ? skills.availability : "Not Set",
//          }
//       });

//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });


// Create account
app.post('/CreateAccount', async (req, res) => {
   try {
      const { f_name, l_name, email, age, university, user_name, password, gender, user_id,  skills_i_want, skills_i_have,availability } = req.body;

      // Validate required fields
      if (!f_name || !l_name || !email || !age || !university || !user_name || !password ) {
         return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const oldUser = await User.findOne({ email });
      if (oldUser) {
         return res.status(400).json({ message: "User already exists" });
      }

      // Encrypt the password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
         f_name,
         l_name,
         email,
         age,
         university,
         password: encryptedPassword,
       // From Skills collection
         user_name,
         user_id,
         gender,
         skills_i_want,
         skills_i_have,
         availability
            });

      res.status(201).json({ message: "User created successfully", data: newUser });
   } catch (error) {
      console.error("Error creating user:", error.message, error.stack);
      res.status(500).json({ message: "Internal server error" });
   }
});

// Add to your backend routes
app.post('/get-user-by-fullname', async (req, res) => {
   try {
     const { fullName } = req.body; // Expecting fullName in the request body
 
     // Check if fullName is provided
     if (!fullName) {
       return res.status(400).json({ error: "Full name is required" });
     }
 
     // Find user by concatenated first + last name
     const user = await User.findOne({ 
       $expr: { 
         $eq: [
           { $concat: ["$f_name", " ", "$l_name"] },
           fullName
         ]
       }
     });
 
     if (!user) {
       return res.status(404).json({ error: "User  not found" });
     }
 
     res.json({ email: user.email });
   } catch (error) {
     console.error("Error fetching user by full name:", error);
     res.status(500).json({ error: "Internal server error" });
   }
 });
// Add skills
app.post("/AddSkills", async (req, res) => {
   try {
       const { email, skills_i_have, skills_i_want, availability } = req.body;

       console.log("Request Body:", req.body); // Log received data

       // Validate input
       if (!email || !skills_i_have || !skills_i_want || !Array.isArray(skills_i_have) || !Array.isArray(skills_i_want)) {
           console.error("Invalid input:", req.body);
           return res.status(400).json({ message: "Invalid input format." });
       }

       // Check if user exists
       const user = await User.findOne({ email });
       if (!user) {
           console.error("User not found for email:", email);
           return res.status(404).json({ message: "User not found." });
       }

       // Create new skill entry
       const newSkill = await Skills.create({
           user_id: user._id,
           skills_i_have,
           skills_i_want,
           availability: availability || "",
           email: user.email,
       });

       console.log("New skill added:", newSkill);
       res.status(201).json({ message: "Skills added successfully", data: newSkill });
   } catch (error) {
       console.error("Error in /AddSkills endpoint:", error);
       res.status(500).json({ message: "Internal server error" });
   }
});



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

// // Fetch user data
// app.post('/userdata', async (req, res) => {
//    const { token } = req.body;
//    try {
//       const user = jwt.verify(token, JWT_SECRET);
//       const useremail = user.email;

//       User.findOne({ email: useremail }).then((data) => {
//          return res.send({ status: "Ok", data: data });
//       });
//    } catch (error) {
//       return res.send({ error: "error" });
//    }
// });

//get user profile data


app.get("/SearchTutors", async (req, res) => {
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

 
      res.status(200).json({ status: "Ok", data: sortedTutors });
   } catch (error) {
      console.error("Error fetching tutors:", error);
      res.status(500).json({ message: "Internal server error" });
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


     res.status(200).json({ status: "Ok", data: sortedTutors });
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