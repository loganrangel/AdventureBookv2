const express = require("express");
const app = express();
const router = require("express").Router();
const bodyParser = require("body-parser");
const db = require("../../database/models");
const storySeeds = require("../../database/storySeeds");

// Setup body-parser middle-ware
// app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.text());

// API route used to retrieve full story, mainly just used for testing
router
    .route("/:key")
    .get((req, res) => {
        // Method used to prevent unauthorized seeding of production db
        // We can setup a more unique key in a secure environment variable down the road
        if(req.params.key === "12345"){
        
            // Empty Story collection
            db.Story.remove({}, function(err) {
                console.log("Existing story collection cleared.");
                if(err){
                    console.log(err);
                }
            });

            // Create a default admin user if not found in DB
            db.User
                .findOne({ userName: "admin" }, (err, user) => {
                    if(!user){
                        console.log("user 'admin' not found! Creating defaut account...");
                        db.User
                            .insertMany({
                                userName: "admin",
                                firstName: "admin",
                                lastName: "user",
                                password: "letmein",
                                bookmark: 1
                                })
                            .then(() => {
                                console.log("Default user created!")
                            });
                    }
                });
            
            // Bulk inserts storySeeds array as defined in /database/storySeeds.js
            // Can be adapted to accept json in req.body, empty collection, and re-seed (baby framework for story creation)
            db.Story
                .insertMany(storySeeds, function(err, docs) {
                    if(err){
                        console.log(err);
                    } else {
                        console.log(`Story collection successfully created!`);
                    }
                });
            res.send("Database seeded successfully!");
        } else {
            res.send("Database seeding failed.");
        }
    });

router
    .route("/:key")
    .post((req, res) => {    
        if(req.params.key === "12345"){
            console.log("Seeds POST route hit!");
            console.log(req.body);
            // res.send(req.body);
            res.json(req.body);
        } else {
            res.send("File upload failed!");
        }
    });

module.exports = router;