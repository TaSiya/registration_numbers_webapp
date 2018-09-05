module.exports = function (pool) {
    
    async function allPlates () {
        let result = await pool.query('select * from registration_numbers');
        return result.rows;
    }
    async function countAll () {
        let count = await pool.query('select count(*) FROM registration_numbers');
        return count.rows[0].count;
    }
    
    return {
        allPlates,
        countAll
        
    }
}