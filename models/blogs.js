const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogSchema = new Schema({
    type: "String",
    author: "String",
    content:"String",

});
 module.exports= mongoose.model("Blog",blogSchema);
