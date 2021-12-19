var express = require('express');
var router = express.Router();
const yahooStockPrice = require('yahoo-stock-prices')
const models = require('../lib/models')

/* Get home page. */
router.get('/', function(req, res, next){
    res.send('this is the API route!')
});

router.get('/search/:symbol', async function(req, res, next){
    console.log(req.params)
    try{
        const data = await yahooStockPrices.getCurrentData(req.params.symbol);
        res.json({success: true, data: data});
    } catch(err){
        console.log(err)
        res.json({success: false, data: {}});
    }
})

router.post('/portfolio', async function(req, res, next){
    console.log('req.body is', req.body)
    let portfolioRow = await models.Portfolio.create({symbol: req.body.stockName, quantity: req.body.buyValue, price: req.body.stockPrice})

})

module.exports = router;