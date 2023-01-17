const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

app.use(bodyParser.urlencoded({extended: true}));

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db', function(err){
  if(err){
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  }else{
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});


const authorRoutes = require("./routes/author");
app.use("/author", authorRoutes);

const readerRoutes = require("./routes/reader");
app.use("/reader", readerRoutes)

app.use(express.static(__dirname + "/styleSheet"));

app.set("views", __dirname + "/views");

//set the app to use ejs for rendering
app.set('view engine', 'ejs');

app.engine("html", require("ejs").renderFile);

app.get('/', (req, res) => {
  res.send('Welcome to Blogging Tool Website - CM2040 Midterm Coursework')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})







