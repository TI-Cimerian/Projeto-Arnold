const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: process.env.DATABASE_PWD,
  database: 'projeto_arnold',
  port: 5432,
})

module.exports = pool
