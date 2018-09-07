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
    describe('checking for existing plates', function () {
        beforeEach(async function () {
            await pool.query('delete from registration_numbers');
        });
        it('checking for the plate CA 123-321',async function () {
            let Service = services(pool);
            await Service.tryAddPlate('CA 321-123',1);
            await Service.tryAddPlate('CY 321-123',1);
            await Service.tryAddPlate('CA 123-321',1);
            await Service.tryAddPlate('CL 321-123',1);
            let result = await Service.selectPlate('CA 123-321');
            let plate = result[0].plates;
            assert.strictEqual(plate, 'CA 123-321');
        });
        it('checking for the plate CY 321-123', async function () {
            let Service = services(pool);
            await Service.tryAddPlate('CA 321-123',1);
            await Service.tryAddPlate('CY 321-123',1);
            await Service.tryAddPlate('CA 123-321',1);
            await Service.tryAddPlate('CL 321-123',1);
            let result = await Service.selectPlate('CY 321-123');
            let plate = result[0].plates;
            assert.strictEqual(plate, 'CY 321-123');
        });
        it('checking for the plate CAW 321-123 return length zore since don\'t exist in the database', async function () {
            let Service = services(pool);
            await Service.tryAddPlate('CA 321-123',1);
            await Service.tryAddPlate('CY 321-123',1);
            await Service.tryAddPlate('CA 123-321',1);
            await Service.tryAddPlate('CL 321-123',1);
            let result = await Service.selectPlate('CAW 321-123');
            let plate = result.length;
            assert.strictEqual(plate, 0);
        });
    });

    after(function () {
        pool.end();
    });
});