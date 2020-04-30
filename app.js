const mysql = require('mysql');
const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');
const Page = require("./Page").Page;
const md5 = require("md5");
var xmlserializer = require('xmlserializer');

let config = {
    host: 'polish-notation-server.mysql.database.azure.com',
    user: 'Kavarna@polish-notation-server',
    password: '!Parolamea123',
    database: 'PolishNotationDatabase',
    port: 3306,
    ssl: true
};

let registerPage = new Page('.*/register.js',
    function(params, req, res) { // post

        conn.query('INSERT INTO users (username,email, password) VALUES (?,?,?);', [params.username, params.email, md5(params.password)],
            function(err, results, fields) {
                let response = {};
                if (err) {
                    response.message = "FAILED";
                } else {
                    console.log('Inserted ' + results.affectedRows + ' row(s).');
                    response.message = "SUCCEEDED";
                }

                res.writeHeader(200, { 'Content-Type': 'application/json' });

                let jsonString = JSON.stringify(response);
                res.write(jsonString);
                res.end();
            });
    }, null, null);

    let commentPage = new Page('.*/comment.js',
    function(params, req, res) {
        conn.query('INSERT INTO comments (email, id_exercise, comment) VALUES (?,?,?);', [params.email, params.id_exercise, params.comment],
            function(err, results, fields) {
                let response = {};
                console.log("coloane inserate");
                if (err) {
                    response.message = "FAILED";
                } else {
                    console.log('Inserted ' + results.affectedRows + ' row(s).');
                    response.message = "SUCCEEDED";
                }
                console.log(response);
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
            console.log("am ajuns aici 1");
            if (err) {
                response.message = "Failure";
                response.id = 'null';
                response.exercise = 'null';
            } else {
                var count = Math.floor(Math.random() * (result.length + 1));
                response.message = 'Succes';
                response.id = result[count].id_exercise;
                response.exercise = result[count].exercise;
            }
            console.log("am ajuns aici 2");
            console.log(response);
            res.writeHeader(200, { 'Content-Type': 'application/json' });

            let jsonString = JSON.stringify(response);
            res.write(jsonString);
            res.end();
        });
    }, null, null);


let loginPage = new Page('.*/login.js',
    function(params, req, res) { // post
        let password = md5(params.password);
        let query = "Select password from users where email = '" + params.email + "'";
        conn.query(query,
            function(err, results, fields) {
                let response = {};
                if (err) {
                    response.message = "FAILED";
                } else {
                    // console.log(results);
                    if (password == results[0].password) {
                        response.message = "SUCCEEDED";
                    } else {
                        response.message = "FAILED";
                    }
                }
                res.writeHeader(200, { 'Content-Type': 'application/json' });

                let jsonString = JSON.stringify(response);
                res.write(jsonString);
                res.end();
            })
    }, null, null);

let pages = [
    registerPage, loginPage, commentPage, exercisePage
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
        if (req.url === '/')
            req.url = "/index.html";
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

http.createServer(serverHandler).listen(3000);