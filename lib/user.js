// A library for representing a user "model".

var pg = require('pg');
var config = require('config');

// Pull connection information from db config file.
var dbConfig = config.get('db.url');

// lookup is a function that takes an email(username) and a password
// in order to sign into a user account for our web application.
exports.lookup = (email, password, cb) => {
    // Connect to the database.
    pg.connect(dbConfig, (err, client, done) => {
        if(err){
        cb("could not connect to database: " + err);
        return;
        }

    // Attempt to locate account linked to user email.
    client.query('select * from users where email = $1', [email], (err, result) => {
        // Release client back to pool.
        done();

        // Check for error from user lookup.
        if(err){
            cb('could not lookup user email: ' + email + " error: " + err);
            return;
        }

        // Check to see if a user was found.
        if(result.rows.length == 0){
            cb('User linked to: ' + email + " does not exist.");
            return;
        }

        // Check password.
        var u = result.rows[0];
        if(u.password != password){
            cb('Incorrect password');
            return;
        }

        // Authenticated: Return user data.
        cb(undefined, u);
    });

    });
};

// list is a function that queries the database for all the users.
//this function is used to display all user information on the admin home.
exports.list = (cb) => {
    // Connect to the database.
    pg.connect(dbConfig, (err, client, done) => {
        if(err){
        cb("could not connect to database: " + err);
        return;
    }

    // Attempt to locate info on all accounts.
    client.query('select * from users', (err, result) => {
        // Release client back to pool.
        done();

    // Check for error from lookup.
    if(err){
        cb('could not lookup user accounts. error: ' + err);
        return;
    }

    // Check to see if a user was found.
    if(result.rows.length == 0){
        cb('No users found in the database.');
        return;
    }

    // Querying was successful, now return the result.rows array which will
    //contain the data of all the users on the database.
    cb(undefined, result.rows);
});

});
};

// The add function is to add a new user to our database.
exports.add = (user, cb) => {
    // Connect to the database.
    pg.connect(dbConfig, (err, client, done) => {
        if(err){
        cb('could not connect to database: ' + err);
        }

    // Check to see if a user is already existing under the email.
    client.query('select email from users where email = $1', [user.email], (err, result) => {
        // Release client back to pool.
        done();

    // Check for error from query.
    if(err){
        cb('could not select from user table: ' + err);
        return;
    }

    if(result.rows.length != 0){
        cb('A user already exists with the email address: ' + user.email);
        return;
    }
});

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

        cb(undefined, user);
    });

    });
};

// The search function takes a unique url (uurl) and a call back function,
// if a user is found based off the uurl, the users fname, lname, and
// email is returned in order to render a user home page.
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

// verifyurl checks our database to see if an existing uurl matches the
// uurl passed as a parameter. If it exists, the callback returns with an error defined,
// otherwise it called the callback with no error and an empty object.
exports.verifyurl = (uurl, cb) => {
    // Connect to the database.
    pg.connect(dbConfig, (err, client, done) => {
        if(err){
        cb('could not connect to database: ' + err);
        return;
    }

    // Call the query on the unique URL provided.
    client.query('select uurl from users where uurl = $1', [uurl], (err, result) => {
        // Release client back to pool.
        done();

    // Check for error from query.
    if(err){
        cb('could not properly query from database: ' + err);
        return;
    }

    // Check to see if user was found.
    if(result.rows.length != 0){
        cb('This unique url already exists!: ' + uurl);
        return;
    }

    cb(undefined, {});
    });

    });
}

