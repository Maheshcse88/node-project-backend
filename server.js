 const Express = require('express');
 const bcrypt = require('bcryptjs');
 const bodyParser = require('body-parser');
//  const uri = 'mongodb+srv://maheshcse88:Sagar124@cluster0.ybemjgm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';
 require('dotenv').config();
 const cookieParser = require('cookie-parser')
 const jwt = require('jsonwebtoken')
 const app = Express();
 app.use(Express.json())
 app.use(bodyParser.urlencoded({extended: true}))
 app.use(cookieParser());  
 app.set('view engine', 'ejs');  // setting the views   before install npm i ejs in cmd

 //import mongoose
 const mongoose = require('mongoose');
 //connect with db
 mongoose.connect(process.env.MONGO_URI)   // install npm i dotenv
// mongoose.connect(uri) 
 //get the connection
 const db = mongoose.connection;

 db.once('open', ()=> {
   console.log('successfully connected to db')
   // console.log(db.collections)
 })
 db.on('error', (error)=> {
   console.log(error)
 })

 // protected route
 app.get('/', (req, res)=> {
    // res.status(200).json({message: 'hello world peers'})
    
    const {token} = req.cookies;         //  // install npm i cookie-parser
    if(token){
      const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if(tokenData.type == 'user'){
        res.render('home');
      }
    }
    else{
      res.redirect('/signin');
    }
    
 })

 //signIn
 app.get('/signin', (req, res)=> {
  res.render('signin');
 })

 //signup
 app.get('/signup', (req, res)=> {
  res.render('signup');
 })

 app.post('/signup', async (req, res)=> {
  const {name, email, password: plainTextPassword} = req.body;
  // console.log(req.body)
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = bcrypt.hashSync(plainTextPassword, salt);
  try{
    await user.create({
      name, 
      email,
      password: encryptedPassword
    });
    res.redirect('/signin');
  }catch(error){
    console.log(error)
  }
})

app.post('/signin', async (req, res)=> {
  const {email, password} = req.body;
  const userObj = await user.findOne({email});
  if(!userObj){
    res.send({error: "user doesnt exist", status: 404});
  }
  try{
    if(bcrypt.compare(password, userObj.password)){
      // creating jwt tokens
      const token = jwt.sign({
        userId: userObj._id, email: email, type: 'user'
      },process.env.JWT_SECRET_KEY, {expiresIn: '2h'});
      res.cookie('token', token, {maxAge: 2*60*60*1000});  
      // res.render('home');
      res.redirect('/');
    }
  }catch(error){
    console.log(error)
  }
})
 const userRouter = require('./routes/user');
 app.use('/users', userRouter);

 const user = require('./models/usermodel')

 app.listen(5001);
 console.log("server listening on 5001")