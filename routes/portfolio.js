var express = require('express');
var router = express.Router();
const yahooStockPrices = require('yahoo-stock-prices')
const {Portfolio, Wallet} = require('../lib/models');


/* Get home page. */
/*router.get('/', function(req, res, next){
    res.send('this is the API route!')
});*/

router.get('/search/:symbol', async function(req, res, next){
    console.log(req.params)
    try{
        const data = await yahooStockPrices.getCurrentData(req.params.symbol);
        res.json({success: true, data: data});
    } catch(err){
        console.log(err)
        res.json({success: false, data: {}});
    }
});
//Create
router.post('/wallet', async function(req, res, next) {
    console.log(req.body)
    let stock = await Portfolio.create(req.body);
    // after this point, the purchase has been made
    let currentWallet = await Wallet.findOne({});
    if(currentWallet){
        let currentWalletValue = currentWallet.value;
        let amountSpent = req.body.quantity * req.body.price;
        let newWalletValue = currentWalletValue - amountSpent;
        console.log('newWalletValue', newWalletValue);
        currentWallet.update({value: newWalletValue})
    }

    // Stock.create(req.body)
    //     .then((stock) => {
    //         res.json({success: true});
    //     })

    res.json(stock);
});
//UPDATE
router.put('/portfolio/:id', async function(req, res, next) {
    // console.log(req.body)
    // console.log(req.params)
    // let stock = await Stock.update()
    // let stock = Stock.update(req.body, {where: req.params.id})
    let stock = await Portfolio.update(req.body, {
        where: {id: req.params.id}
    });
    res.json(stock);
});

// DELETE
router.delete('/portfolio/:id', async function(req, res, next) {
    // console.log(req.params)

    let currentStock = await Portfolio.findOne({where: {id: req.params.id}});
    if(currentStock) {
        let symbol = currentStock.symbol;
        let quantity = currentStock.quantity;
        const data = await yahooStockPrices.getCurrentData(symbol);
        console.log(data)

        let cashEarnedFromStockSale = parseInt(parseInt(quantity) * data.price);

        let currentWallet = await Wallet.findOne({});
        if(currentWallet){
            let currentWalletValue = parseInt(currentWallet.value);
            let newWalletValue = currentWalletValue + cashEarnedFromStockSale;
            console.log('newWalletValue', newWalletValue);
            await currentWallet.update({value: newWalletValue})
        }

        let stock = await Portfolio.destroy({where: {id: req.params.id}});
        // update the wallet happens here
        // res.json(stock);
        res.json(stock);

    }

});

/* GET users listing. */
router.get('/', async function(req, res, next) {

    console.log('I WAS HERE *********')

    let items = await Portfolio.findAll({})

    // console.log(items);
    res.json(items);
});


/*router.post('/portfolio', async function(req, res, next){
    console.log('req.body is', req.body)
    let portfolioRow = await models.Portfolio.create({symbol: req.body.stockName, quantity: req.body.buyValue, price: req.body.stockPrice})
    res.json(portfolioRow)
})*/

module.exports = router;