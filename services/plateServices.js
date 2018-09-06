module.exports = function (pool) {
    
    async function allPlates () {
        let result = await pool.query('select * from registration_numbers');
        return result.rows;
    }
    async function countAll () {
        let count = await pool.query('select count(*) FROM registration_numbers');
        return count.rows[0].count;
    }
    async function insertPlate (location, plate, locationID) {
        await pool.query('insert into registration_numbers (plates,towns_id,status) values ($1,$2,$3)',[plate,locationID,'Not found']);
    }
    async function updateStatus(plate, status){
        await pool.query('update registration_numbers set status=$1 where plates=$2',[plate]);
    }
    async function filter (location) {
        let loc = await pool.query('select * from towns where town_name= $1', [location])

    }
    
    return {
        allPlates,
        countAll,
        filter
        
    }
}