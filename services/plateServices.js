module.exports = function (pool) {
    
    async function platesData () {
        let result = await pool.query('select * from registration_numbers');
        return result.rows;
    }
    async function filterByTown (town) {
        let filtered = await pool.query('select * from registration_numbers where plates LIKE $1', ['%'+town+' %']);
        return filtered.rows;
    }
    async function selectTown (name) {
        let town = await pool.query('select * from towns where initials = $1',[name]);
        return town.rows;
    }
    async function selectPlate (plate) {
        let result = await pool.query('select * from registration_numbers where plates =$1', [plate]);
        return result.rows;
    }
    async function townData () {
        let result = await pool.query('select * from towns');
        return result.rows;
    }
    async function countAll () {
        let count = await pool.query('select count(*) FROM registration_numbers');
        return count.rows[0].count;
    }
    async function insertPlate (plate, locationID) {
        await pool.query('insert into registration_numbers (plates,towns_id,status) values ($1,$2,$3)',[plate,locationID,'Not found']);
    }
    async function updateStatus(plate, status){
        await pool.query('update registration_numbers set status=$1 where plates=$2',[status, plate]);
    }
    async function allData () {    
        let data = await pool.query('SELECT * FROM towns INNER JOIN registration_numbers ON towns.id = registration_numbers.towns_id');
        return data.rows;
    }
    async function foundOrNot (search) {
        let found = await pool.query('SELECT * FROM towns INNER JOIN registration_numbers ON towns.id = registration_numbers.towns_id WHERE status=$1',[search]);
        return found.rows;
    }
    async function remove () {
        await pool.query('delete from registration_numbers');
    }
    async function tryAddPlate (plate, id) {
        let result = await selectPlate(plate);
        if(result.length != 0) {
            return false;
        }
        else{
            await insertPlate(plate, id);
            return true;
        }
    }
    
    return {
        platesData,
        countAll,
        allData,
        foundOrNot,
        townData,
        filterByTown,
        selectTown,
        insertPlate,
        remove,
        tryAddPlate
    }
}