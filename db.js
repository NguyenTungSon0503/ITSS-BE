import pg from 'pg';
const {Pool} = pg;

let localPoolConfig = {
    host: 'localhost',
    port: 5432,
    database: 'jwttest',
    user: 'postgres',
    password: 'tungsontk3'
}

const poolConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false},
} : localPoolConfig

const pool = new Pool(poolConfig)

export default pool;