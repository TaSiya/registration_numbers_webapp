module.exports = function (pool) {
    
    async function allPlates () {
        let result = await pool.query('select * from registration_numbers');
        return result.rows;
    }
    
    return {
        allPlates,
        
    }
}