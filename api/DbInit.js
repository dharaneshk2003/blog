
require('dotenv').config();
let cnt_string = process.env.CONNECTION_STRING;
const mongoose = require('mongoose');
mongoose.connect(cnt_string)
.then(()=>{
    console.log('connected to database');
}).catch(err=>{
    console.log(err);
});

module.exports = mongoose;