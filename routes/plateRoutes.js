
module.exports = function (services) {

    async function home ( req, res) {
        res.render('./')
    }
    async function report (req, res) {
        let heading = 'Hi, There. Our services are Free!'
        let stylePlate = 'found';
        let reg_plates = await services.platesData();
        let town_list = await services.townData();
        let town_name = town_list[5].town_name;
        res.render('report',{heading, reg_plates, stylePlate, town_list,town_name});
    }
    async function reportFilter (req, res) {
        try{
            let location = req.params.town;
            let reg_plates;
            if(location === 'all'){
                reg_plates = await services.platesData();
            } else {
                reg_plates = await services.filterByTown(location);
            }
            let heading = 'Filtering by '+location ;
            let town_list = await services.townData();
            let townList = await services.selectByInitialsTown(location);
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
                let town_list = await services.selectTown(initial);
                let flag = await services.tryAddPlate(plate,town_list[0].id);
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
            let reg_plates = await services.platesData();
            let stylePlate = 'found';
            let counter = await services.countAll();
            res.render('plates',{heading, reg_plates, stylePlate, counter});
        } catch(err) {
            res.send(err.stack);
        }
        
    }
    async function combinedData (req, res) {
        try{
            let heading = 'Combined plates';
            let listData = await services.allData();
            let counter = await services.countAll();
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
            
            let listData = await services.foundOrNot(decide);
            let counter = listData.length;
            res.render('plates', {heading, listData, counter})
        } catch (err) {
            res.send(err.stack)
        }
    }
    async function removeAll (req, res) {
        try{
            await services.remove();
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