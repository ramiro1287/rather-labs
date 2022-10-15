const handleError = require('../utils/errorHandler');


function dataChecker(req, res, next) {
	var error = null;
	const body = req.body;

	const { depth } = req.query;
	if (depth == undefined || !['1', '25', '500'].includes(depth)) {
		error = { status: 400, msg: 'Invalid depth param' }
	}

	for (var prop in body) {
		if (body[prop]==='') {
			error = { status: 400, msg: "Invalid params" };
			break;
		}
		if (!['amount', 'type', 'pair', 'limit'].includes(prop)) {
			error = { status: 400, msg: 'Invalid params' };
			break;
		}
		if (prop === 'limit' && isNaN(body[prop])) {
			error = { status: 400, msg: "Invalid limit" };
			break;
		}
	}

	if (error) handleError(error, res);
    else next();
}

module.exports = dataChecker;
