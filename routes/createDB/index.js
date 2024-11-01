const Router = require('express')
const routes = new Router()
const createDB = require('./RegLogUser')

routes.use('/auth', createDB)

module.exports=routes