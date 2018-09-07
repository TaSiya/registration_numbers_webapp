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
        let town_name = town_list[5].town_name;
        res.render('report',{heading, reg_plates, stylePlate, town_list,town_name});
    }
    async function reportFilter (req, res) {
        try{
            let location = req.params.town;
            let reg_plates;
            if(location === 'all'){
                reg_plates = await Services.platesData();
            } else {
                reg_plates = await Services.filterByTown(location);
            }
            let heading = 'Filtering by '+location ;
            let town_list = await Services.townData();
            let townList = await Services.selectByInitialsTown(location);
            let town_name = townList[0].town_name;
            res.render('report',{heading, reg_plates,town_list,town_name});
        } catch (err) { res.send(err.stack)}
        
    }
    async function reporting (req, res) {
        try{
            let plate = req.body.username;
            if(plate === '' || plate === undefined){
                req.flash('info', "Please Enter a valid registration number")
            } else {
                
                ////////?/ right here
                let list = plate.split(' ');
                let initial = list[0];
                let town_list = await Services.selectTown(initial);
                let flag = await Services.tryAddPlate(plate,town_list[0].id);
                if(!flag){
                    req.flash('info', 'Cannot enter plate that already exist')
                } else {
                    req.flash('found', plate)
                }
            }
            res.redirect('report');
        } catch (err) { res.send(err.stack)}
        
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
    async function removeAll (req, res) {
        try{
            await Services.remove();
            res.redirect('/');
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
        foundOrNotFOund,
        reportFilter,
        removeAll
    }
}