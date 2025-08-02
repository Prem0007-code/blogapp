const express = require('express');
const mongoose = require('mongoose');
const Blog = require("./models/blogs.js");
const path = require("path");
const methodOverride = require('method-override');
const session = require('express-session');
const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("./models/User.js");
require('dotenv').config();

const app = express();
app.use(express.json());
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
const dburl = process.env.ATLAS_URL;
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    expires: Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
   }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user; // passport puts the logged-in user here
  next();
});



mongoose.connect(dburl)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));
  
  app.get("/",(req,res)=>{
    res.send("server is working");
  });
  app.get("/blog", async(req,res)=>{
    let blogs =  await Blog.find();
    
    res.render("index.ejs",{blogs});
  });

  app.get("/demouser",async(req,res)=>{
    let fakeUser = new User({
      email:"abc@gmail.com",
      username: "prem",
    });
     let regUser=await User.register(fakeUser,"hello");
     res.send(regUser);
  });

  app.get("/blog/new",(req,res)=>{
    res.render("new.ejs");
  });

  app.post("/blog/",async(req,res)=>{
    let{type,author,content}= req.body;
    let newblog = new Blog({
      type: type,
      author:author,
      content: content,
    });
    await newblog.save();
    res.redirect("/blog");
  });

  app.get("/blog/:id/edit", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  res.render("edit.ejs", { blog });
});

  app.put("/blog/:id",async(req,res)=>{
    let{id}=req.params;
    const { type, content } = req.body;
    let blog=  await Blog.findByIdAndUpdate(id,{type,content});
    res.redirect("/blog");

  });

  // Show signup form
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

// Handle signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect("/blog");
    });
  } catch (e) {
    res.send("Signup failed: " + e.message);
  }
});

// Show login form
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Handle login
app.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/blog"
}));

// Logout route
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/blog");
  });
});

  const PORT = 3000;
  app.listen(PORT,()=>{
    console.log("server is running on port ");
  });
