import { Request, Response, NextFunction } from 'express'

// log
const log = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err?.stack)
	next(err)
}

// xhr
const clientHandle = (err: any, req: Request, res: Response, next: NextFunction) => {
	if (req.xhr) {
		res.status(500).send({ error: err })
	} else {
		next(err)
	}
}

// default
const handle = (err: any, req: Request, res: Response, next: NextFunction) => {
	// if you create a UI and error page for your api, you can render it here
	res.status(500)
	res.json({ error: err.stack })
}

export { log, clientHandle, handle }
