const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'BD2_2024',
    password: '14y21r16k05b',
    port: 5432,
});

module.exports = pool;
