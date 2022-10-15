require('dotenv').config();
const router = require('express').Router();
const handleError = require('../utils/errorHandler');
const axios = require('axios');


router.get('/:pair', async (req, res) => {
	try {
		var { depth } = req.query;
		if (depth == undefined || !['1', '25', '500'].includes(depth)) {
			throw { status: 400, msg: 'Invalid depth param' };
		}
		const { pair } = req.params;
		const orderBookUrl = `https://api.bittrex.com/v3/markets/${pair}/orderbook?depth=${depth}`;

		try {
			const { data } = await axios.get(orderBookUrl);
			const { bid, ask } = data;
			var bestAskPrice = { amount: 0, rate: 999999999999 }
			var bestBidPrice = { amount: 0, rate: 0 }

			for (var n=0; n < depth; n++) {
				if (bid[n].rate > bestBidPrice.rate) bestBidPrice = bid[n];
				if (ask[n].rate < bestAskPrice.rate) bestAskPrice = ask[n];
			}

			res.json({
				status_code: 200,
				body: {
					pair,
					ask: { price: bestAskPrice.rate, amount: bestAskPrice.quantity },
					bid: { price: bestBidPrice.rate, amount: bestBidPrice.quantity },
				}
			});
		} catch (err) {
			if (err.response.status == '404') throw { status: 404, msg: 'Invalid pair' };
			throw { status: 500, msg: 'Error' }
		}
	} catch(err) {
		handleError(err, res);
	}
});

module.exports = router;
