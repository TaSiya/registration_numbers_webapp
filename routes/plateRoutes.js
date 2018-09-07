const plateServices = require('../services/plateServices');
module.exports = function (pool) {
    const Services = plateServices(pool);
    async function home ( req, res) {
        res.render('./')
    }
    async function report (req, res) {
        let heading = 'Hi, There. Our services are Free!'
        let stylePlate = 'found';
        let reg_plates = await Services.platesData();
        let town_list = await Services.townData();
        res.render('report',{heading, reg_plates, stylePlate, town_list});
    }
    async function reportFilter (req, res) {
        let location = req.params.town;

        let heading = 'Filtering by '+location ;

        res.render('report',{heading, reg_plates, stylePlate, town_list});
    }
    async function reporting (req, res) {
        let name = req.body.username;
        if(name === '' || name === undefined){
            req.flash('info', "Please Enter a valid registration number")
        } else {
            req.flash('found', name)
        }
        res.redirect('report');
    }
    async function plates (req, res) {
        try{
            let heading = 'Reported plates';
            let reg_plates = await Services.platesData();
            let stylePlate = 'found';
            let counter = await Services.countAll();
            res.render('plates',{heading, reg_plates, stylePlate, counter});
        } catch(err) {
            res.send(err.stack);
        }
        
    }
    async function combinedData (req, res) {
        try{
            let heading = 'Combined plates';
            let listData = await Services.allData();
            let counter = await Services.countAll();
            res.render('plates', {heading, listData, counter})
        } catch (err) {
            res.send(err.stack)
        }
    }
    async function foundOrNotFOund (req, res) {
        try{
            let decide = req.params.which;
            let heading;
            if(decide === 'found'){
               heading = 'Found plates';
            }
            else{
                decide = 'Not found'
                heading = 'Not found plates';
            }
            
            let listData = await Services.foundOrNot(decide);
            let counter = listData.length;
            res.render('plates', {heading, listData, counter})
        } catch (err) {
            res.send(err.stack)
        }
    }
    return {
        home,
        report,
        reporting,
        plates,
        combinedData,
        foundOrNotFOund
    }
}