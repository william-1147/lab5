const express = require("express");
const mongodb = require("mongodb");
const bodyparser = require('body-parser');
const morgan = require('morgan');


const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('css'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('common'));
app.listen(8080);

//Configure MongoDB
const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017/";

//reference to the database (i.e. collection)
let db;
//Connect to mongoDB server
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095db");
        }
    });


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/newTask', function (req, res) {
    res.sendFile(__dirname + '/views/newTask.html');
});


app.post('/newTask', function (req, res) {
    let taskDetails = req.body;

    let newId = Math.round(Math.random()*100);

    db.collection('tasks').insertOne({ 
        id: newId, 
        taskName: taskDetails.tname, 
        assignTo: taskDetails.assto, 
        taskDue: taskDetails.tdue, 
        taskStatus: taskDetails.tstatus, 
        taskDesc: taskDetails.tdesc
    });
    res.redirect('/listTask');
});

/*app.get('/listTask', function (req, res) {
    res.sendFile(__dirname + '/listTask.html');
});*/

app.get('/listTask', function (req, res) {
    db.collection('tasks').find({}).toArray(function (err, data) {
        if(err){
            res.redirect('/404');
        }else{
            res.render('listTask.html', { taskDb: data });
        } 
    });
});

app.get('/updatetask', function (req, res) {
    res.sendFile(__dirname + '/views/updateTask.html');
});

app.post('/updateTaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = { id: parseInt(taskDetails.taskID) };
    let theUpdate = { $set: { taskStatus: taskDetails.newtstatus} };
    db.collection('tasks').updateOne(filter, theUpdate);
    res.redirect('/listTask');
});

app.get('/deleteTask', function (req, res) {
    res.sendFile(__dirname + '/views/deleteTask.html');
});

app.post('/deletetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = { id: parseInt(taskDetails.taskID) };
    db.collection('tasks').deleteOne(filter);
    res.redirect('/listTask');
});

