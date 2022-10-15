require('dotenv').config();
const router = require('express').Router();
const handleError = require('../utils/errorHandler');
const dataChecker = require('../utils/tradeValidator');
const axios = require('axios');


router.post('', dataChecker, async (req, res) => {
	try {
		const { depth } = req.query
		const { amount, pair, type, limit } = req.body
		const orderBookUrl = `https://api.bittrex.com/v3/markets/${pair}/orderbook?depth=${depth}`;
		const { data } = await axios.get(orderBookUrl);
		const { bid, ask } = data;

		if (type === 'ask') {
			let ordersUsed = [];
			let restAmount = amount;
			let limitReached = false;

			for (var n=0; n < depth; n++) {
				if (limit && ask[n].rate > limit) {
					limitReached = true;
					break;
				}

				restAmount = restAmount - ask[n].quantity;
				ordersUsed.push(ask[n])
				if (restAmount <= 0) {
					restAmount = 0;
					break;
				}
			}

			res.json({
				status_code: 200,
				body: { pair, type, restAmount, limitReached, orders: ordersUsed.length, ordersUsed }
			});
		}
		else if (type === 'bid') {
			let ordersUsed = [];
			let restAmount = amount;
			let limitReached = false;

			for (var n=0; n < depth; n++) {
				if (limit && ask[n].rate > limit) {
					limitReached = true;
					break;
				}

				restAmount = restAmount - bid[n].quantity;
				ordersUsed.push(bid[n])
				if (restAmount <= 0) {
					restAmount = 0;
					break;
				}
			}

			res.json({
				status_code: 200,
				body: { pair, type, restAmount, limitReached, orders: ordersUsed.length, ordersUsed }
			});
		}
		else res.json({ status_code: 400, body: { detail: 'Invalid type' } });
	} catch(err) {
		if (err.response.status == '404') handleError({ status: 404, msg: 'Invalid pair' }, res);
		else handleError({ status: 500, msg: 'Error' }, res);
	}
});

module.exports = router;
