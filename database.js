var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'polish-notation-server.mysql.database.azure.com',
    user: 'Kavarna@polish-notation-server',
    password: '!Parolamea123',
    database: 'PolishNotationDatabase',
    port: 3306,
    ssl: true
});

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

/*-----------------One Time Run ---------------------/*
/*Drop Tables*/
// dropTable("comments");
//dropTable("user_progress");
//dropTable("users");
// dropTable("exercises");


//*Create Tables*/
//createTableUsers();
// createTableExercises();
// createTableComments();
//createTableUserProgress();

/*Commit Changes*/
//commitChanges();

/*Populate Table Exercises*/
// populateTable();
// commitCahnges();
/*-----------------One Time Run ---------------------/*

/*Select From Tables*/
//selectFromTable("user_progress");
//selectFromTable("comments");
//selectFromTable("users");

function dropTable(tableName) {
    conn.query("Drop Table " + tableName, function(err, result, fields) {
        if (err) throw err;
        console.log('Dropped Table ' + tableName);
    });
}

function createTableUsers() {
    var query = "CREATE TABLE IF NOT EXISTS users (username varchar(30) NOT NULL Unique PRIMARY KEY,password Varchar(100));";
    conn.query(query, function(err, result, fields) {
        if (err) throw err;
        console.log('Table users created');
    });
}

function createTableExercises() {
    var query = "CREATE TABLE IF NOT EXISTS exercises (id_exercise int NOT NULL AUTO_INCREMENT PRIMARY KEY,exercise Varchar(200));";
    conn.query(query, function(err, result, fields) {
        if (err) throw err;
        console.log('Table exercices created');
    });
}

function createTableComments() {
    var query = "CREATE TABLE IF NOT EXISTS comments (id_exercise int NOT NULL,username varchar(30),comment Varchar(200), CONSTRAINT fk_comments FOREIGN KEY (id_exercise) REFERENCES exercises(id_exercise) ON DELETE CASCADE);";
    conn.query(query, function(err, result, fields) {
        if (err) throw err;
        console.log('Table comments created');
    });
}

function createTableUserProgress() {
    var query = "CREATE TABLE IF NOT EXISTS user_progress (id_exercise int NOT NULL,username Varchar(30) NOT NULL, CONSTRAINT fk FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,CONSTRAINT pk_user_progress PRIMARY KEY(id_exercise,username));"
    conn.query(query, function(err, result, fields) {
        if (err) throw err;
        console.log('Table user_progress created');
    });
}

function commitChanges() {
    conn.query("Commit;", function(err, result, fields) {
        if (err) throw err;
        console.log('Commit successfull...');
    });
};

function selectFromTable(tableName) {
    conn.query("Select * from " + tableName, function(err, result, fields) {
        if (err) throw err;
        console.log(result)
    });
};

function select(exerciseId) {
    let query = "Select exercise from exercises where id_exercise = '" + exerciseId + "'";
    conn.query(query, function(err, result, fields) {
        if (err) throw err;
        console.log(result[0].exercise);
    });
};

function select(user) {
    let query = "Select id_exercise from user_progress where username = '" + user + "'";
    conn.query(query, function(err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
};



function populateTable() {
    var exercises = ["_ * _ + _ /_", "_ * (_ + _ / _)", "((_ * (_ + _) )/ _)", "(_ * (_ + (_ / _)- _)", "_ + _ + _ + _", "( _ + _ ) * _ - ( _ - _ ) * ( _ + _ )", "_ - _ + ( _ * _ )/ ( _ / _ ) - ( _ + _ )", "( _ - _ )", "((( _ + _)/ _) * _ ) - _"];
    let i, nr, res;
    let resultat;
    let results = [];
    let str;
    for (i = 0; i < exercises.length; i++) {
        str = exercises[i];
        resultat = str.replace(/_/g, function() {
            return Math.floor(Math.random() * 20) + 1;
        });
        results.push(resultat);
    }
    for (i = 0; i < results.length; i++) {
        console.log(results[i]);
        insertIntoTable(results[i]);
    }
};


function insertIntoTable(exercise) {
    conn.query("INSERT INTO exercises (exercise) VALUES (?);", (String(exercise)), function(err, result, fields) {
        if (err) throw err;
        console.log('Inserted ' + result.affectedRows + ' row(s).');
        console.log('Insert successfull... ' + exercise);
    });
}