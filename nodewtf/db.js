const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "842308nmsd",
    host: "localhost",
    port: 5432,
    database: "Kursach"
})


module.exports = pool