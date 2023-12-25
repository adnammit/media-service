import express from 'express'
import User from '../data/user'
import UserTitle from '../data/user-title'
import UserList from '../data/user-list'

const router = express.Router()

router
	.route('/hello/')
	.get((req, res) => { res.send('Hello World! 👋🏻') });

router
	.route('/users/')
	.get(User.getUsers)
	.put(User.addUser)

router
	.route('/users/:id')
	.put(User.updateUser)

router
	.route('/users/:id/titles')
	.get(UserTitle.getUserTitles)
	.put(UserTitle.addUserTitle)

router
	.route('/users/:id/titles/:titleId')
	.put(UserTitle.updateUserTitle)
	.delete(UserTitle.deleteUserTitle)

router
	.route('/users/:id/lists')
	.get(UserList.getUserLists)
	.put(UserList.addUserList)

router
	.route('/lists/:id')
	.put(UserList.updateUserList)
	.delete(UserList.deleteUserList)

router
	.route('/lists/:id/titles/:titleId')
	.put(UserList.addUserListItem)
	.delete(UserList.deleteUserListItem)

export default router

