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
selectFromComments();

function populateTable() {
    var exercises = ["_ * _ + _ /_", "_ * (_ + _ / _)", "((_ * (_ + _) ) / _)", "(_ * (_ + (_ / _) ) )", "_ + _ + _ + _", "( _ + _ ) * _ - ( _ - _ ) * ( _ + _ )"];
    var i;

    for (i = 0; i < exercises.length; i++) {
        insertIntoTable(exercises[i]);
        commitChanges();
    }
};

function insertIntoTable(exercise) {
    conn.query("INSERT INTO exercises (exercise) VALUES (?);", (String(exercise)), function(err, result, fields) {
        if (err) throw err;
        console.log('Inserted ' + result.affectedRows + ' row(s).');
        console.log('Insert successfull...');
    });
}

function commitChanges() {
    conn.query("Commit;", function(err, result, fields) {
        if (err) throw err;
        console.log('Commit successfull...');
    });
};

function deleteFromTable() {
    conn.query("Delete from comments where id_exercise >= 11;", function(err, result, fields) {
        if (err) throw err;
        console.log('Delete Successfull...');
    });
}


function selectFromTable() {
    conn.query("Select * from exercises;", function(err, result, fields) {
        if (err) throw err;
        var i;
        for (i = 0; i < result.length; i++) {
            console.log(result[i].id_exercise);
            console.log(result[i].exercise)
        }
    });
};

function selectFromComments() {
    conn.query("Select * from comments;", function(err, result, fields) {
        if (err) throw err;
        var i;
        for (i = 0; i < result.length; i++) {
            console.log(result[i].id_exercise);
            console.log(result[i].email);
            console.log(result[i].comment);
        }
    });
};