const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const UsersModel = require('./models/users')
const QuestionsModel = require('./models/questions')
require('dotenv').config();


const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error: ', err));
  
  app.post ('/Userinfo', async (req,res)=>{

    const {UserEmail} = req.params;
    const exist = await UsersModel.findOne({ UserEmail });
    if (exist) {
        return res.status(200).send("Already exists");
    }
    try {
           const NewUser = new UsersModel (
            {  UserEmail }
        );
       await NewUser.save();
       res.send("Data Inserted")
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send("Error inserting data");
    }
})

app.get('/GetQby/:Q_Num', async (req, res) => {
  try {
    const { Q_Num } = req.params;
    const question = await QuestionsModel.findOne({ Q_Num: Number(Q_Num) });

    if (!question) {
      return res.status(404).send({ message: 'Question not found' });
    }

    res.send(question);
  } catch (error) {
    console.error('error fetching question:', error);
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

app.post('/validateAnswer', async (req, res) => {
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
    const isCorrect = question.flag === submittedAns;

    if (!isCorrect) {
      return res.status(200).send({ 
        canProceed: false, 
        message: 'Incorrect answer. Please try again.' 
      });
    }

    // If correct, update user's progress
    const user = await UsersModel.findOne({ UserEmail: userEmail });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Check if the question is already solved
    if (!user.QnsSolved.includes(Qno)) {
      user.QnsSolved.push(Qno);
      await user.save();
    }

    // Allow the user to proceed
    res.status(200).send({ 
      canProceed: true, 
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