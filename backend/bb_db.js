// bb_db.js
//
// BetterBallot SQL Database
//
// LAST MODIFIED
// 2024-12-12

// Database constants
// +-----------------------------------+


// Database hosted on MySQL
// +-----------------------------------+
const mysql            = require('mysql');
const { createPortal } = require('react-dom');

/**
 * Database connection object representing a MySQL database.
 */
class BB_Database {
    // Private data members
    // +-----------------------------------+

    #hostname;          // Hostname of the database
    #port    ;          // Listening port (integer value)
    #username;          // Username of database account
    #password;          // Password of database account
    #database;          // Database name

    // Public data members
    // +-----------------------------------+

    connection = null;

    /**
     * Constructs a BB_DB object, which is used to perform
     * operations on a MySQL database, such as connecting to
     * a database server.
     * 
     * @param {string} hostname Hostname of database
     * @param {BigInt} port     Server port of database
     * @param {string} username Username of account accessing database
     * @param {string} password Password of account accessing database
     * @param {string} database Name of database (optional)
     */
    constructor(hostname, port, username, password, database) {
        this.#hostname = hostname;
        this.#port     = port;
        this.#username = username;
        this.#password = password;
        this.#database = database;
    }

    /**
     * Retrieves a database connection object.
     * 
     * @returns A database connection object if successful, otherwise ```null```.
     */
    getConnection() {
        return connection;
    }

    /**
     * Connects to a MySQL database.
     */
    connect() {
        connection  = mysql.createConnection({
            host    : this.#hostname,
            port    : this.#port,
            user    : this.#username,
            password: this.#password
        });

        connection.connect(function(err) {
            if (err) {
                throw new ConnectionError("Connection to MySQL database failed" + err.stack);
            }
        });

        console.log(connection.threadId);
    }

    // TODO: Create query tests to test connection stability.
    // Consider timed and synchronous testing in the event of unexpected termination.

    testQueries() {
        
    }

    /**
     *  Terminates a connection instantly without completing all queries.
     */
    terminate() {
        if (getConnection() === null) {
            throw new ConnectionError("Attempted to end or terminate a nonexistent connection.");
        }

        // Terminate connection instantly.
        connection.terminate();
    }

    /**
     * Terminates a connection to a MySQL database safely.
     */
    end() {

        // NOTE: Do not forget to catch this!       
        if (getConnection() === null) {
            throw new ConnectionError("Attempted to end or terminate a nonexistent connection.");
        }
        
        // Safely end an active, stable connection.
        connection.end();
    }
}

// External functions
// +-----------------------------------+


// Exception classes
// +-----------------------------------+

/**
 *  Throws when a connection error occurs while an instance
 *  of BB_Database is active.
 */
class ConnectionError extends Error {
    // Private data members
    // +-----------------------------------+

    constructor(msg, options) {
        super(msg, options);
    }
}

/**
 *  Throws when an attempt to retrieve data fails.
 */
class FailedToFetchInfoError extends Error {
    // Private data members
    // +-----------------------------------+

    constructor(msg, options) {
        super(msg, options);
    }
}