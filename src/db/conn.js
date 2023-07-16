const mongoose =  require("mongoose");
require('dotenv').config();
// password is password of mongodb atlas
mongoose.connect(`mongodb+srv://pshivanshu99:${process.env.PASSWORD}@cluster0.hioyqnn.mongodb.net/?retryWrites=true&w=majority`)
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to db'));

db.once('open', function () {
  console.log('Your database is up ...')
});


