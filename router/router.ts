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
	.route('/:id/titles')
	.get(UserTitle.getUserTitles)
	.put(UserTitle.addUserTitle)

router
	.route('/:id/titles/:titleId')
	.put(UserTitle.updateUserTitle)
	.delete(UserTitle.deleteUserTitle)

export default router

