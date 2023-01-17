const express = require("express");
const router = express.Router();
module.exports = router;


//Get Reader Homepage
router.get("/home", (req, res) => {//query database
                                    let sqlqueryAuSetDisplay = "SELECT * FROM authors";
                                    let sqlquery = "SELECT * FROM pubArticles ORDER BY published DESC";

                                    //execute sql query
                                    //Display Author Settings
                                    function db1(sqlqueryAuSetDisplay, callback){
                                        global.db.all(sqlqueryAuSetDisplay, (err, result) => {
                                            if(err){
                                                return console.error("Error: " + err.message);
                                            }else{
                                                callback(null, result);
                                            }
                                        });
                                    }

                                    //Display all published articles (descendant - lastest published first)
                                    function db2(sqlquery, callback){
                                        global.db.all(sqlquery, (err, result) => {
                                            if(err){
                                                return console.error("Error: " + err.message);
                                            }else{
                                                callback(null, result);
                                            }
                                        });
                                    }


                                    db1(sqlqueryAuSetDisplay, function(err, result1){
                                        if(err){
                                            return console.error("Error: " + err.message);
                                        }else{
                                            db2(sqlquery, function(err, result2){
                                                if(err){
                                                    return console.error("Error: " + err.message);
                                                }else{
                                                    res.render("readerHomepage.ejs", {auSetDisplays: result1, listPubArticles: result2});                                             
                                                }
                                            });
                                        }
                                    });    
                                  });


//Get Reader Article Details Page (reading an article)
router.get("/article", (req, res) => {//query database
                                        let targetReadArticle = [req.query.readBut];

                                        let sqlqueryAuSetDisplay = "SELECT * FROM authors";
                                        let sqlqueryRead = "SELECT * FROM pubArticles WHERE pubID = ?";
                                        let sqlqueryComList = "SELECT * FROM comments WHERE comID = ? ORDER BY comPublished DESC";

                                        //execute sql query
                                        //Display Author Settings
                                        function db1(sqlqueryAuSetDisplay, callback){
                                            global.db.all(sqlqueryAuSetDisplay, (err, result) => {
                                                if(err){
                                                    return console.error("Error: " + err.message);
                                                }else{
                                                    callback(null, result);
                                                }
                                            });
                                        }

                                        //Select the chosen published article
                                        function db2(sqlqueryRead, targetReadArticle, callback){
                                            global.db.all(sqlqueryRead, targetReadArticle, (err, result) => {
                                                if(err){
                                                    return console.error("Error: " + err.message);
                                                }else{
                                                    callback(null, result);
                                                }
                                            });
                                        }

                                        //All comments of the chosen article
                                        function db3(sqlqueryComList, targetReadArticle, callback){
                                            global.db.all(sqlqueryComList, targetReadArticle, (err, result) => {
                                                if(err){
                                                    return console.error("Error: " + err.message);
                                                }else{
                                                    callback(null, result);
                                                }
                                            });
                                        }


                                        db1(sqlqueryAuSetDisplay, function(err, result1){
                                            if(err){
                                                return console.error("Error: " + err.message);
                                            }else{
                                                db2(sqlqueryRead, targetReadArticle, function(err, result2){
                                                    if(err){
                                                        return console.error("Error: " + err.message);
                                                    }else{
                                                        db3(sqlqueryComList, targetReadArticle, function(err, result3){
                                                            if(err){
                                                                return console.error("Error: " + err.message);
                                                            }else{
                                                                res.render("readerArticle.ejs", {auSetDisplays: result1, readArticles: result2, commentsList: result3});                                             
                                                            }
                                                        });                                            
                                                    }
                                                });
                                            }
                                        });    
                                    });


//Post Reader Article Details Page
router.post("/article", (req, res) => {//query database
                                        let targetLikeArticle = [req.body.likeBut];
                                        let targetCommentArticle = [req.body.commentBut, req.body.commentBox];

                                        let sqlqueryLike = "UPDATE pubArticles SET likes = likes + 1 WHERE pubID = ?";
                                        let sqlqueryComment = "INSERT INTO comments ('comID', 'comPublished', 'comWords') VALUES (?, DATETIME('now'), ?)";

                                        //execute sql query
                                        //Update likes number when like button is clicked
                                        if(req.body.likeBut !== undefined)
                                        {
                                            global.db.run(sqlqueryLike, targetLikeArticle, (err, result) => {//execute
                                                                                                    if(err){
                                                                                                        return console.error("Error: " + err.message);
                                                                                                    }else{                                                                                                        
                                                                                                        // res.redirect("back");       
                                                                                                        res.redirect(req.get("referer"));                                                                                                                                                                                                          
                                                                                                    }
                                                                                                });
                                            return;                                                   
                                        }
                                        
                                        //Insert a new comment to the comments list
                                        if(req.body.commentBox !== undefined)
                                        {
                                            global.db.run(sqlqueryComment, targetCommentArticle, (err, result) => {//execute
                                                                                                    if(err){
                                                                                                        return console.error("Error: " + err.message);
                                                                                                    }else{                                                                                                         
                                                                                                        // res.redirect("back");       
                                                                                                        res.redirect(req.get("referer"));                                                                                                                                                                                                          
                                                                                                    }
                                                                                                });
                                            return;                                                    
                                        }
                                    });
