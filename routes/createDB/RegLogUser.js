const Router = require('express')
const routes = new Router()
const CreateDB = require('../../controllers/createDB/User')

routes.post('/registration', CreateDB.registration)
routes.post('/login', CreateDB.login)


module.exports=routes