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
  

app.get("/GetAllQ", async (req,res)=>{

  try {
    const data = await QuestionsModel.find({});
    
    res.json({ success: true, msg: "server is getting", data1: data });
} catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send("Error fetching data");
}

})

app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`)
})