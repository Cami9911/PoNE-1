const mysql = require('mysql');
const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');
const md5 = require("md5");

class Page {
    constructor(regexPattern = null, actionPost = null, getRegexPattern = null, actionGet = null) {

        this.regexPattern = regexPattern;
        this.actionPost = actionPost;
        this.actionGet = actionGet;
        this.getRegexPattern = getRegexPattern;

    }

    matchesPagePost(page) {
        if (this.regexPattern) {
            return page.match(this.regexPattern);
        } else {
            return false;
        }
    }

    matchesPageGet(page) {
        if (this.getRegexPattern) {
            return page.match(this.getRegexPattern);
        } else {
            return false;
        }
    }

    get(params, req, res) {
        if (this.actionGet) {
            this.actionGet(params, req, res);
        }
    }

    post(params, req, res) {
        if (this.actionPost) {
            this.actionPost(params, req, res);
        }
    }
}

let config = {
    host: 'polish-notation-server.mysql.database.azure.com',
    user: 'Kavarna@polish-notation-server',
    password: '!Parolamea123',
    database: 'PolishNotationDatabase',
    port: 3306,
    ssl: true,
    connectionLimit: 5,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    waitForConnections: true,
    queueLimit: 0,
};

let registerPage = new Page('.*/register.js',
    function(params, req, res) {
        conn.query('INSERT INTO users (username,password) VALUES (?,?);', [params.name, md5(params.password)],
            function(err, results, fields) {
                let response = {};
                if (err) {
                    response.status = "Failed";
                    response.message = "There is already an user with the same username";
                } else {
                    console.log('Inserted ' + results.affectedRows + ' row(s).');
                    response.status = "Success";
                    response.message = "Account created";
                    response.username = params.name;
                }

                res.writeHeader(200, { 'Content-Type': 'application/json' });

                let jsonString = JSON.stringify(response);
                res.write(jsonString);
                res.end();
            });
    }, null, null);

let adminPage = new Page('.*/admin.js',
    function(params, req, res) { // post
        conn.query(params.command,
            function(err, results, fields) {
                let response = {};
                if (err) {
                    response.status = "Failed";
                    response.message = "Invalid command";
                } else {
                    response.status = "Succes";
                    response.message = "Command created";
                    response.resultSql = results;
                }

                res.writeHeader(200, { 'Content-Type': 'application/json' });

                let jsonString = JSON.stringify(response);
                res.write(jsonString);
                res.end();
            });
    }, null, null);

let commentPage = new Page('.*/comment.js',
    function(params, req, res) {
        conn.query('INSERT INTO comments (username, id_exercise, comment) VALUES (?,?,?);', [params.username, params.id_exercise, params.comment],
            function(err, results, fields) {
                let response = {};
                if (err) {
                    response.message = "Failed";
                } else {
                    console.log('Inserted ' + results.affectedRows + ' row(s).');
                    response.message = "Success";
                }
                res.writeHeader(200, { 'Content-Type': 'application/json' });

                let jsonString = JSON.stringify(response);
                res.write(jsonString);
                res.end();
            });
    }, null, null);

let exercisePage = new Page('.*/exercise.js',
    function(params, req, res) {
        conn.query("Select * from exercises;", function(err, result, fields) {
            let response = {};

            if (err) {
                response.message = "Failure";
                response.id = 'null';
                response.exercise = 'null';
            } else {
                var count = Math.floor(Math.random() * (result.length));
                response.message = 'Succes';
                response.id = result[count].id_exercise;
                response.exercise = result[count].exercise;
            }
            res.writeHeader(200, { 'Content-Type': 'application/json' });

            let jsonString = JSON.stringify(response);
            res.write(jsonString);
            res.end();
        });
    }, null, null);

let getCommentPage = new Page('.*/getComments.js',
    function(params, req, res) {
        conn.query("Select * from comments where id_exercise= '" + params.id_exercise + "'", function(err, result, fields) {
            var arrayOfObjects = [];
            var response = {};
            var data = {};
            if (err) {
                data.message = 'Failure';
                data.comments = [];
            } else {
                data.message = "Succes";
                for (i = 0; i < result.length; i++) {
                    response = {};
                    response.username = result[i].username;
                    response.comment = result[i].comment;
                    arrayOfObjects[i] = response;
                }
                data.comments = arrayOfObjects;
            }
            res.writeHeader(200, { 'Content-Type': 'application/json' });

            let jsonString = JSON.stringify(data);
            res.write(jsonString);
            res.end();
        });
    }, null, null);

let loginPage = new Page('.*/login.js',
    function(params, req, res) { // post
        let password = md5(params.password);
        let query = "Select password from users where username = '" + params.name + "'";
        conn.query(query,
            function(err, results, fields) {
                let response = {};
                if (err) {
                    response.status = "Failed";
                    response.message = "SQL server error";
                } else {
                    if (results.length > 0) {
                        if (password == results[0].password) {
                            response.status = "Succes";
                            response.message = "User authenticated";
                        } else {
                            response.status = "Failed";
                            response.message = "Password Incorrect";
                        }
                    } else {
                        response.status = "Failed";
                        response.message = "There is no user registered with this username";
                    }
                }
                res.writeHeader(200, { 'Content-Type': 'application/json' });

                let jsonString = JSON.stringify(response);
                res.write(jsonString);
                res.end();
            })
    }, null, null);

/*Insert user's progress in DB */
let progressPage = new Page('.*/progress.js',
    function(params, req, res) {
console.log("din SERVER"+params.username +" "+ params.id_exercise);

        conn.query('INSERT INTO user_progress (id_exercise, username) VALUES (?,?);', [params.id_exercise, params.username],
            function(err, results, fields) {
                let response = {};
                if (err) {
                    response.message = "Failed";
                    console.log(err +" din server");
                } else {
                    response.message = "Succes";
                }
                res.writeHeader(200, { 'Content-Type': 'application/json' });

                let jsonString = JSON.stringify(response);
                res.write(jsonString);
                res.end();
            });
    }, null, null);

/*Get user progress form DB */
let getProgressPage = new Page('.*/getProgress.js',
    function(params, req, res) { // post
        let query = "SELECT exercises.exercise, exercises.id_exercise FROM exercises WHERE id_exercise IN (SELECT id_exercise FROM user_progress WHERE username = '" + params.username + "'" + " )";
        conn.query(query,
            function(err, results, fields) {
                let response = {};
                if (err) {
                    response.message = 'Failure';
                    response.data = [];
                } else {
                    let info = [];
                    response.message = 'Succes';
                    for (i = 0; i < results.length; i++) {
                        let test = {};
                        test.id_exercise = results[i].id_exercise;
                        test.exercise = results[i].exercise;
                        info.push(test);
                    }
                    response.data = info;

                }
                res.writeHeader(200, { 'Content-Type': 'application/json' });

                let jsonString = JSON.stringify(response);
                res.write(jsonString);
                res.end();
            })
    },
    null, null);


let pages = [
    registerPage, loginPage, commentPage, exercisePage, getCommentPage, adminPage, progressPage, getProgressPage
]

const conn = new mysql.createConnection(config);
conn.connect(
    function(err) {
        if (err) {
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        } else {
            console.log("Connection established.");
        }
    });

function serveFile(req, res, ext) {
    handleGetRequest(req, res, function() {
        if (req.url === '/.html')
            req.url = "/main.html";
        fs.readFile("./src" + req.url, (err, data) => {
            if (err) {
                req.url = "/unknown.html";
                fs.readFile("./src" + req.url, (err, data) => {
                    res.writeHeader(200, { 'Content-Type': ext });
                    res.write(data);
                    res.end();
                });
                return;
            }
            res.writeHeader(200, { 'Content-Type': ext });
            res.write(data);
            res.end();
        });
    });
}

function handlePostRequest(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        for (let i = 0; i < pages.length; ++i) {
            if (pages[i].matchesPagePost(req.url)) {
                pages[i].post(parse(body), req, res);
            }
        }
    });
}

function handleGetRequest(req, res, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let called = false;
        for (let i = 0; i < pages.length; ++i) {
            if (pages[i].matchesPageGet(req.url)) {
                pages[i].get(req.url, req, res);
                called = true;
            }
        }
        if (!called) {
            if (callback)
                callback();
        }
    });
}

function serverHandler(req, res, type) {
    console.log(req.url);
    let ext = req.headers.accept.split(',')[0];
    if (req.method === "POST") {
        handlePostRequest(req, res);
        return;
    }
    console.log(ext);
    switch (ext) {
        case "text/html":
            req.url = req.url + ".html"
            serveFile(req, res, ext);
            return;
        case "text/css":
        case "text/plain":
        case "application/javascript":
        case "application/json":
        case "application/xml":
        case "application/x-shockwave-flash":
        case "video/x-flv":
        case "image/png":
        case "image/jpeg":
        case "image/gif":
        case "image/bmp":
        case "image/vnd.microsoft.icon":
        case "image/tiff":
        case "image/svg+xml":
        case "image/webp":
        case "*/*":
            serveFile(req, res, ext);
            return;
        default:
            console.log("Unknown request: " + ext);
    }
}


function view() {
    conn.query('SELECT * FROM users;', function(err, results, fields) {
        if (err) throw err;
        console.log(results);
    });
}


const port = process.env.PORT || 3000;

http.createServer(serverHandler).listen(port);

console.log("Starting server on port " + port);