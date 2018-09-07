const services = require('../services/plateServices');
const assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;

if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/registration_app_database';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

describe('Registratiob number Web Application test(s)', function () {
    describe('Counting data in database', function () {
        beforeEach(async function () {
            await pool.query('delete from registration_numbers');
        });
        it('it should return zero(0) if not data', async function () {
            let Service = services(pool);
            let result = await Service.countAll();
            assert.strictEqual(result, 0); 
        });
        it('it should return 4 if not data', async function () {
            let Service = services(pool);
            await Service.tryAddPlate('CA 123-321',1);
            await Service.tryAddPlate('CA 321-123',1);
            await Service.tryAddPlate('CY 321-123',1);
            await Service.tryAddPlate('CL 321-123',1);
            let result = await Service.countAll();
            assert.strictEqual(result, 4); 
        });
    });
    

    after(function () {
        pool.end();
    });
});