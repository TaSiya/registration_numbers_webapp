const Services = require('../services/plateServices');
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
            let service = Services(pool);
            let result = await service.countAll();
            assert.strictEqual(result, 0); 
        });
        it('it should return 4 if not data', async function () {
            let service = Services(pool);
            await service.tryAddPlate('CA 321-123',1);
            await service.tryAddPlate('CY 321-123',2);
            await service.tryAddPlate('CA 123-321',1);
            await service.tryAddPlate('CL 321-123',3);
            let result = await service.countAll();
            assert.strictEqual(result, 4); 
        });
    });
    describe('checking for existing plates', function () {
        beforeEach(async function () {
            await pool.query('delete from registration_numbers');
        });
        it('checking for the plate CA 123-321',async function () {
            let service = Services(pool);
            await service.tryAddPlate('CA 321-123',1);
            await service.tryAddPlate('CY 321-123',2);
            await service.tryAddPlate('CA 123-321',1);
            await service.tryAddPlate('CL 321-123',3);
            let result = await service.selectPlate('CA 123-321');
            let plate = result[0].plates;
            assert.strictEqual(plate, 'CA 123-321');
        });
        it('checking for the plate CY 321-123', async function () {
            let service = Services(pool);
            await service.tryAddPlate('CA 321-123',1);
            await service.tryAddPlate('CY 321-123',2);
            await service.tryAddPlate('CA 123-321',1);
            await service.tryAddPlate('CL 321-123',3);
            let result = await service.selectPlate('CY 321-123');
            let plate = result[0].plates;
            assert.strictEqual(plate, 'CY 321-123');
        });
        it('checking for the plate CAW 321-123 return length zore since don\'t exist in the database', async function () {
            let service = Services(pool);
            await service.tryAddPlate('CA 321-123',1);
            await service.tryAddPlate('CY 321-123',2);
            await service.tryAddPlate('CA 123-321',1);
            await service.tryAddPlate('CL 321-123',3);
            let result = await service.selectPlate('CAW 321-123');
            let plate = result.length;
            assert.strictEqual(plate, 0);
        });
    });
    describe('linking both tables', function () {
        beforeEach( async function () {
            await pool.query('delete from registration_numbers');
        })
        it('should tell if the plate CA 123-321 is from Cape Town', async function () {
            let service = Services(pool);
            await service.tryAddPlate('CA 321-123',1);
            await service.tryAddPlate('CY 321-123',2);
            await service.tryAddPlate('CA 123-321',1);
            await service.tryAddPlate('CL 321-123',3);
            let plateData = await service.selectJoinedTableData('CA 123-321');
            let plate = plateData[0].town_name;
            assert.strictEqual(plate, 'Cape Town');
        });
        it('should tell if the plate CY 321-123 is from Belville', async function () {
            let service = Services(pool);
            await service.tryAddPlate('CA 321-123',1);
            await service.tryAddPlate('CY 321-123',2);
            await service.tryAddPlate('CA 123-321',1);
            await service.tryAddPlate('CL 321-123',3);
            let plateData = await service.selectJoinedTableData('CY 321-123');
            let plate = plateData[0].town_name;
            assert.strictEqual(plate, 'Belville');
        });
    });
    
    after(function () {
        pool.end();
    });
});