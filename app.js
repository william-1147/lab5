const mongoose = require('mongoose');
const express = require("express");
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongodb = require("mongodb");

const url = "mongodb://localhost:27017/taskDB";
const MongoClient = mongodb.MongoClient;
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('css'));
app.use(express.static('images'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('common'));
app.listen(8080);

//const Developer = require('./models/developer');
const Task = require('./models/tasks');

MongoClient.connect(url , {useNewUrlParser: true },
    function (err, client) {
        if(err){
            console.log("Err ", err);
        } 
        else {
            console.log("Connection successfully to Mongo server");
            db = client.db("taskDB"); //DB Name
        }
    });

mongoose.connect(url, function (err) {
    if(err){
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected to Mongoose');
});

    var taskDB = mongoose.connection;
    app.get('/', function (req, res){
    res.render('index.html');
    });

    app.get('/listTask', function (req, res){
    Task.find( {}, function (err, docs){
        res.render('listTask', {taskDB: docs});
        });
    });

    app.get('/newTask', function (req, res){
    res.sendFile(__dirname + '/views/newTask.html');
    });

    app.get('/updateTask', function (req, res){
    res.sendFile(__dirname + '/views/updateTask.html' , {taskDB:db});
    });

    app.get('/deleteTask', function (req, res){
    res.sendFile(__dirname + '/views/deleteTask.html' , {taskDB:db});
    });

      

    app.post('/newTask', function (req, res){
        let taskDetails = req.body;
        var task1 = new Task({
            _id: new mongoose.Types.ObjectId(),
            name: taskDetails.tname,
            assign: taskDetails.assto,
            dueDate: taskDetails.due,
            status: taskDetails.stat,
            description: taskDetails.desc
        });
        task1.save(function (err){
            if(err) throw err;
            console.log('Task successfully added to DB');
        });
        res.redirect('/listTask');
    });

    app.post('/updateTask', function (req, res){
    let taskdetails = req.body;
    Task.updateOne({'_id': taskdetails.id }, { $set: {
            //name: taskdetails.tname,
            //assign: taskdetails.assto,
            //dueDate: taskdetails.due,
            status: taskdetails.newStatus,
            //description: taskdetails.desc
            }
        },
        function (err, doc) {
            console.log("Task successfully deleted");     
        });
    res.redirect('/listTask');
    });

    app.post('/deleteTask', function (req, res){
    let taskdetails = req.body;
    Task.deleteOne({ '_id': taskdetails.id }, function(err, doc){
        console.log("Task deleted");
    });
    res.redirect('/listTask');
    });

    app.post('/deleteAll', function (req, res){
    let taskdetails = req.body;
    Task.deleteMany( {'status':'Complete'}, function(err, doc){
        console.log("All tasks deleted");
    });
    res.redirect('/listTask');
    });

   
   
