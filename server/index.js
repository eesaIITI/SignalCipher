const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const UsersModel = require('./models/users')
const QuestionsModel = require('./models/questions')
require('dotenv').config();


const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json()); 

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error: ', err));


  //new user
  app.post('/Userinfo', async (req, res) => {
    // Extract UserEmail from the request body
    const { UserEmail } = req.body;
  
    // Check if the user already exists in the database
    const exist = await UsersModel.findOne({ UserEmail });
    if (exist) {
      return res.status(200).send("Already exists");
    }
  
    try {
      // Create a new user and save it to the database
      const NewUser = new UsersModel({ UserEmail });
      await NewUser.save();
      res.send("Data Inserted");
    } catch (err) {
      console.error('Error inserting data:', err);
      res.status(500).send("Error inserting data");
    }
  });
  
  //getting user info
  app.get("/getUserInfo", async (req, res) => {
    const { email } = req.query;  // Use req.query to get the email from the URL
  
    try {
      const user = await UsersModel.findOne({ UserEmail: email });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send(user); // Send the user data back
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });
  


//getting qns from db

app.get('/Fetch_Question', async (req, res) => {
  try {
    const { Q_Num } = req.query; // Use req.query instead of req.body
    if (!Q_Num) {
      return res.status(400).send({ message: 'Q_Num is required' });
    }

    const question = await QuestionsModel.findOne({ Q_Num: Number(Q_Num) }, '-Flag');
    if (!question) {
      return res.status(404).send({ message: 'Question not found' });
    }
    console.log(question);
    res.send(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).send({ message: 'Error fetching the question' });
  }
});


app.get("/GetAllQ", async (req,res)=>{

  try {
    const data = await QuestionsModel.find({});
    
    res.json({ success: true, msg: "server is getting", data1: data });
} catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send("Error fetching data");
}

})


app.post("/validateAnswer", async (req, res) => {
  const { userEmail, Qno, submittedAns } = req.body;

 

  // Validate input
  if (!userEmail || !Qno || !submittedAns) {
    return res.status(400).send({ message: 'userEmail, Qno, and submittedAns are required' });
  }

  try {
    // Fetch the question by Qno
    const question = await QuestionsModel.findOne({ Q_Num: Number(Qno) });
    if (!question) {
      return res.status(404).send({ message: 'Question not found' });
    }

  

    // Check if the submitted answer matches the correct answer
    const isCorrect = question.Flag === submittedAns;
   

    if (!isCorrect) {
      return res.status(200).send({ 
        isCorrect: false, 
        message: 'Incorrect answer. Please try again.' 
      });
    }

    // If correct, update user's progress
    const user = await UsersModel.findOne({ UserEmail: userEmail });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Check if the question is already solved
    if (!user.Qns_Solved.includes(Qno)) {
      user.Qns_Solved.push(Qno);
      await user.save();
    }

    // Allow the user to proceed
    res.status(200).send({ 
      isCorrect: true, 
      message: 'Correct answer! You can proceed to the next question.' 
    });
  } catch (error) {
    console.error('Error validating answer:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`)
})