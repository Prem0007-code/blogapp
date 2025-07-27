const express = require('express');
const mongoose = require('mongoose');
const data = require("./data.js");
const Blog=require("../models/blogs.js");
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/blogs')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

  const initDb = async()=>{
     await Blog.deleteMany({});
    await Blog.insertMany(data);
  };
  initDb();

  