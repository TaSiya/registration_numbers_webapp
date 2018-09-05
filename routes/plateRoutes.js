const plateServices = require('../services/plateServices');
module.exports = function (pool) {
    const Services = plateServices(pool);
    async function home ( req, res) {
        res.render('./')
    }
    async function report (req, res) {
        let heading = 'Hi, There. Our services are Free!'
        let stylePlate = 'found';
        res.render('report',{heading,stylePlate});
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
            let reg_plates = await Services.allPlates();
            let stylePlate = 'found';
            let counter = await Services.countAll();
            res.render('plates',{heading, reg_plates, stylePlate, counter});
        } catch(err) {
            res.send(err.stack);
        }
        
    }
    return {
        home,
        report,
        reporting,
        plates
    }
}