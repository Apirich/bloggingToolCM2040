const express = require("express");
const router = express.Router();
module.exports = router;


// Get Author Homepage
router.get("/home", (req, res) => { //query database to get all articles
                                    let sqlqueryAuSetDisplay = "SELECT * FROM authors";
                                    let sqlquery = "select * from articles";
                                    let sqlqueryPubArt = "select * from pubArticles";

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

                                    //Display Draft Articles
                                    function db2(sqlquery, callback){
                                        global.db.all(sqlquery, (err, result) => {
                                            if(err){
                                                return console.error("Error: " + err.message);
                                            }else{
                                                callback(null, result);
                                            }
                                        });
                                    }

                                    //Display Published Articles
                                    function db3(sqlqueryPubArt, callback){
                                        global.db.all(sqlqueryPubArt, (err, result) => {
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
                                                    db3(sqlqueryPubArt, function(err, result3){
                                                        if(err){
                                                            return console.error("Error: " + err.message);
                                                        }else{
                                                            res.render("authorHomepage.ejs", {auSetDisplays: result1, draftArticles: result2, pubArticles: result3});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });  


//Post Author Homepage
router.post("/home", (req, res) => { //query database to get all articles                                 
                                    let targetPubArticle = [req.body.pubBut];   
                                    let targetDelArticle = [req.body.delBut];  
                                    let targetPubDelArticle = [req.body.pubDelBut];     

                                    let targetUpArticle = [req.body.title, req.body.subtitle, req.body.body, req.body.upBut];    
                                    let targetCreDraftArticle = [req.body.title, req.body.subtitle, req.body.body];       
                                    let auSetUpdate = [req.body.blogTitle, req.body.blogSubtitle, req.body.auName, req.body.upSetBut];      

                                    //execute sql query when pubBut is clicked
                                    //Publish an article to pubArticles table and Delete it from articles table (Draft Articles)
                                    if(req.body.pubBut !== undefined)
                                    {                      
                                        let sqlquery= "INSERT INTO pubArticles ('title', 'subtitle', 'created', 'published', 'likes', 'body') SELECT title, subtitle, created, DATETIME('now'), 0, body FROM articles WHERE draID = ?";                                   
                                        let sqlqueryDelDra = "DELETE FROM articles WHERE draID = ?";
                
                                        function db1(sqlquery, targetPubArticle, callback){
                                            global.db.run(sqlquery, targetPubArticle, (err, result) => {
                                                if(err){
                                                    return console.error("Error: " + err.message);
                                                }else{
                                                    callback(null, result);
                                                }
                                            });
                                        }

                                        function db2(sqlqueryDelDra, targetPubArticle, callback){
                                            global.db.run(sqlqueryDelDra, targetPubArticle, (err, result) => {
                                                if(err){
                                                    return console.error("Error: " + err.message);
                                                }else{
                                                    callback(null, result);
                                                }
                                            });
                                        }

                                        db1(sqlquery, targetPubArticle, function(err, result1){
                                            if(err){
                                                return console.error("Error: " + err.message);
                                            }else{
                                                db2(sqlqueryDelDra, targetPubArticle, function(err, result2){
                                                    if(err){
                                                        return console.error("Error: " + err.message);
                                                    }else{
                                                        res.redirect("./home");                                                   
                                                    }
                                                });
                                            }
                                        });
                                        return;
                                    }//execute sql query when delBut is clicked  
                                    //Delete a draft article                         
                                    if(req.body.delBut !== undefined)
                                    {            
                                        let sqlqueryDelDraft = "DELETE FROM articles WHERE draID = ?";
                                        global.db.run(sqlqueryDelDraft, targetDelArticle, function (err, rows){//execute
                                                                                                if(err){
                                                                                                    return console.error("Error: " + err.message);
                                                                                                }else{
                                                                                                    res.redirect("./home");
                                                                                                }
                                                                                          });
                                        return;                                                 
                                    }//execute sql query when pubDelBut is clicked
                                    //Delete a published article and all comments about it
                                    if(req.body.pubDelBut !== undefined)
                                    {         
                                        let sqlqueryDelCom = "DELETE FROM comments WHERE comID = ?";   
                                        let sqlqueryDelPub = "DELETE FROM pubArticles WHERE pubID = ?";
                                        
                                        function db1(sqlqueryDelCom, targetPubDelArticle, callback){
                                            global.db.run(sqlqueryDelCom, targetPubDelArticle, (err, result) => {
                                                if(err){
                                                    return console.error("Error: " + err.message);
                                                }else{
                                                    callback(null, result);
                                                }
                                            });
                                        }

                                        function db2(sqlqueryDelPub, targetPubDelArticle, callback){
                                            global.db.run(sqlqueryDelPub, targetPubDelArticle, (err, result) => {
                                                if(err){
                                                    return console.error("Error: " + err.message);
                                                }else{
                                                    callback(null, result);
                                                }
                                            });
                                        }

                                        db1(sqlqueryDelCom, targetPubDelArticle, function(err, result1){
                                            if(err){
                                                return console.error("Error: " + err.message);
                                            }else{
                                                db2(sqlqueryDelPub, targetPubDelArticle, function(err, result2){
                                                    if(err){
                                                        return console.error("Error: " + err.message);
                                                    }else{
                                                        res.redirect("./home");
                                                    }
                                                });
                                            }
                                        });

                                        return;                                              
                                    }//execute sql query when upBut is clicked
                                    //Edit an article or Create a new draft
                                    if(req.body.upBut !== undefined)
                                    {
                                        if(req.body.upBut !== "")
                                        {
                                            let sqlqueryUpdate = "UPDATE articles SET title = ?, subtitle = ?, body = ?, lastModified = DATETIME('now') WHERE draID = ?";
                                            global.db.run(sqlqueryUpdate, targetUpArticle, (err, rows) => {//execute
                                                                                                                if(err){
                                                                                                                    return console.error("Error: " + err.message);
                                                                                                                }else{
                                                                                                                    res.redirect("./home");
                                                                                                                }
                                                                                                            });
                                            return;   
                                        }       
                                        if(req.body.upBut == "")
                                        {                                          
                                            let sqlqueryCreateDraft = "INSERT INTO articles ('title', 'subtitle', 'created', 'lastModified', 'body') VALUES (?, ?, DATETIME('now'), DATETIME('now'), ?)";
                                            global.db.run(sqlqueryCreateDraft, targetCreDraftArticle, (err, result) => {//execute
                                                                                                                            if(err){
                                                                                                                                return console.error("Error: " + err.message);
                                                                                                                            }else{
                                                                                                                                res.redirect("./home");
                                                                                                                            }
                                                                                                                        });
                                            return;                                                                              
                                        }                                                                        
                                    }//execute sql query when upSetBut is clicked
                                    //Update Author Settings and POST to Author Homepage
                                    if(req.body.upSetBut !== undefined)
                                    {
                                        let sqlquery = "UPDATE authors SET blogTitle = ?, blogSubtitle = ?, auName = ? WHERE auID = ?";
                                        global.db.run(sqlquery, auSetUpdate, (err, result) => {//execute
                                                                                                if(err){
                                                                                                    return console.error("Error: " + err.message);
                                                                                                }else{
                                                                                                    res.redirect("./home");
                                                                                                }
                                                                                            });
                                        return;
                                    }
                                });  


//Get Article Edit Page
router.get("/article/edit", (req, res) => {//query database                                            
                                            let targetEditArticle = [req.query.ediBut];

                                            let sqlqueryAuSetDisplay = "SELECT * FROM authors";

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
                                            
                                            //Select the article to edit
                                            let sqlquery = "SELECT * FROM articles WHERE draID = ?";
                                            function db2(sqlquery, targetEditArticle, callback){
                                                global.db.all(sqlquery, targetEditArticle, (err, result) => {
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
                                                    db2(sqlquery, targetEditArticle, function(err, result2){
                                                        if(err){
                                                            return console.error("Error: " + err.message);
                                                        }else{
                                                            res.render("authorEdit.ejs", {auSetDisplays: result1, editArticles: result2});
                                                        }
                                                    });
                                                }
                                            });                       
                                        });


//Get Author Settings Page
router.get("/settings", (req, res) => {//query database
                                        let sqlquery = "SELECT * FROM authors";

                                        //Select author (default: one author in database)
                                        global.db.all(sqlquery, (err, result) => {//execute
                                                                                    if(err){
                                                                                        return console.error("Error: " + err.message);
                                                                                    }else{
                                                                                        res.render("authorSettings.ejs", {auSettings: result});
                                                                                    }
                                                                                });
                                    });
