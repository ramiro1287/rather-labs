function handleError(err, res) {
	const { status, msg } = err
	if (status == undefined) res.json({status: 500, body: { detail: 'Error' }});
	else res.json({status: status, body: { detail: msg }});
}

module.exports = handleError;
