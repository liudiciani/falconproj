// A library for representing a user "model".

var pg = require('pg');
var config = require('config');

// Pull connection information from db config file.
var dbConfig = config.get('db.url');

// @TODO
exports.add = (user, cb) => {
    //Connect to the database.
    pg.connect(dbConfig, (err, client, done) => {
        if(err){
        cb('could not connect to database: ' + err);
    }

    // Attempt to insert a new user into users table.
    client.query('insert into users (fname, lname, email, password, uurl, admin, phone) values ($1, $2, $3, $4, $5, $6, $7)',
        [user.fname, user.lname, user.email, user.password, user.uurl, user.admin, user.phone], (err, result) => {
        //Release client back to pool.
        done();

        // Check for error from insert query.
        if(err){
            cb('could not insert into users table: ' + err);
            return;
        }

        // @TODO: Do we want to change this cb? Is it even rows[0]?
        // Currently returning the new user to the callback function.
        var u = result.row[0];
        console.log(u); //Debug.
        cb(undefined, u);
    });

    });
};

// @TODO
exports.search = (uurl, cb) => {
    // Connect to the database.
    pg.connect(dbConfig, (err, client, done) => {
        if(err){
        cb('could not connect to database: ' + err);
        return;
        }

    // Call the query on the unique URL provided.
    client.query('select fname, lname, email from users where uurl = $1', [uurl], (err, result) => {
        // Release client back to pool.
        done();

        // Check for error from query.
        if(err){
            cb('could not properly query from database: ' + err);
            return;
        }

        // Check to see if user was found.
        if(result.rows.length == 0){
            cb('Invalid unique url: ' + uurl);
            return;
        }

        // Invoke call back with user data.
    var user = result.rows[0];
        cb(undefined, user);
    });

    });
};

