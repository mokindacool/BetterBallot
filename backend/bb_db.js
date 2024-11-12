// bb_db.js
//
// BetterBallot SQL Database
//
// LAST MODIFIED
// 2024-11-12

// Database constants
// +-----------------------------------+
let connection = null;


// Database hosted on MySQL
// +-----------------------------------+
const mysql      = require('mysql');
const { createPortal } = require('react-dom');

class BB_DB {
    // Private data members:
    #hostname;          // Hostname of the database
    #port    ;          // Listening port (integer value)
    #username;          // Username of database account
    #password;          // Password of database account
    #database;          // Database name

    /**
     * Constructs a BB_DB object, which is used to perform
     * operations on a MySQL database, such as connecting to
     * a database server.
     * 
     * @param {string} hostname 
     * @param {BigInt} port 
     * @param {string} username 
     * @param {string} password 
     * @param {string} database 
     */

    constructor(hostname, port, username, password, database) {
        this.#hostname = hostname;
        this.#port     = port;
        this.#username = username;
        this.#password = password;
        this.#database = database;
    }

    /**
     * Connects to a MySQL database.
     */

    connect() {
        connection     = mysql.createConnection({
            host    : this.#hostname,
            port    : this.#port,
            user    : this.#username,
            password: this.#password
        });
    }

    /**
     * Terminates a connection to a MySQL database.
     */

    end() {

    }
}

