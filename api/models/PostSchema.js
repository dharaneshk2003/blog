const mongoose = require('../DbInit')
let {Schema,model} = mongoose
const User = require('./userSchema')


const PostSchema = new Schema({
    title: String,
    summary:String,
    content:String,
    image:String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps:true,
})

const Post = model('Post',PostSchema)
module.exports = Post;
