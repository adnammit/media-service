// // log to stderr
// const log = (err, req, res, next) => {
// 	console.error(err.stack)
// 	next(err)
// }

// // for xhr
// const clientHandle = (err, req, res, next) => {
// 	if (req.xhr) {
// 		res.status(500).send({ error: err })
// 	} else {
// 		next(err)
// 	}
// }

// // default
// const handle = (err, req, res, next) => {
// 	// if you create an error page, you can render it here instead
// 	res.status(500)
// 	res.json({ error: err.stack })
// }

// export { log, clientHandle, handle }
