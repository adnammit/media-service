import express from 'express'
import User from '../data/user'
import UserTitle from '../data/user-title'

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

export default router

