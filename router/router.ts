import express from 'express'
import User from '../data/user'
import UserTitle from '../data/userTitle'

const router = express.Router()

router
	.route('/')
	.get(User.getUsers)
	.put(User.addUser)

router
	.route('/:id')
	.put(User.updateUser)

router
	.route('/:id/title')
	.get(UserTitle.getUserTitles)
	.put(UserTitle.addOrUpdateUserTitle)

router
	.route('/:id/title/:titleId')
	.delete(UserTitle.deleteUserTitle)
	// .put((req, res) => {
	// 	UserMedia.updateUserMovie(req, res)
	// })
	// .post((req, res) => {
	// 	UserMedia.addUserMovie(req, res)
	// })

// router
// 	.route('/:id/movies/:movie_id')
// 	.get(UserMovie.getUserMovie)
// 	.delete((req, res) => {
// 		UserMovie.deleteUserMovie(req, res)
// 	})

// router
// 	.route('/:id/tv')
// 	.get(UserTv.getUserTvs)
// 	.put((req, res) => {
// 		UserTv.updateUserTv(req, res)
// 	})
// 	.post((req, res) => {
// 		UserTv.addUserTv(req, res)
// 	})

// router
// 	.route('/:id/tv/:tv_id')
// 	.get(UserTv.getUserTv)
// 	.delete((req, res) => {
// 		UserTv.deleteUserTv(req, res)
// 	})

export default router

