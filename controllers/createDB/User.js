const { Sequelize } = require('../../database')
const { User} = require('../../models/model')
const ApiError = require('../../ApiError')
const { Op }= require("sequelize");
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const generateJwt = (id_user, password, role) => {
    return jwt.sign(
        {id_user, password, role},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}


class CreateUser {
    async registration(req, res, next) {
        try {
            const { login, password, passwordCheck} = req.body
            if (!passwordCheck) {
                return next(ApiError.badRequest('Введите пароль еще раз'))
            }
            if (password !== passwordCheck) {
                return next(ApiError.badRequest('Пароли не совпадают'))
            }
            if (!passwordCheck) {
                return next(ApiError.badRequest("Повторно введите ваш пароль"))
            }
            if (password == passwordCheck) {
                const hashpassword = await bcrypt.hash(password, 5)
                const user = await User.create({
                    id_user: uuid.v4() , login, password: hashpassword
                })
                const token = generateJwt(user.id_user, user.role)
                return res.json({token})
            }
            else return next(ApiError.badRequest('Пароли не совпадают'))

        }
        catch (error) {
            next(ApiError.badRequest("Что-то пошло не так"))
            console.log(error)
        }
    }

    async login(req,res,next){
        try {
            const {login, password} = req.body
            if(!password){    
                return next(ApiError.badRequest('Введите пароль'))
            }
            const obj={email,phone} //объект для динамического условия из-за возможности не вводить почту или телефон
            let condition = []
            condition = Object.entries(obj).reduce((accum,[key,value])=>{ //запись в accum пар [key,value]
                if(value) { //запись значений не являющихся undefined или null
                    accum[key]=value
                }
                return accum
            },{}) //используем объект как первичное значение accum
            console.log(condition)
    
            const user = await User.findOne({
                where:{[Op.or]:condition}
            })
            if(!user){
                return next(ApiError.internal('Введен неверный логин или нет учётной записи'))
            }
    
            //Сравнение незашифрованного пароля password с зашифрованным user.password (password:hashpassword)
            let comparePassword = bcrypt.compareSync(password, user.password)
            if(!comparePassword){ //если пароли не совпадают
                return next(ApiError.internal("Указан неверный пароль"))
            }
            
            const token = generateJwt(user.id_user, user.role)
            return res.status(200).json({token})
        } catch (error) {
            next(ApiError.badRequest("Что-то пошло не так"))
            console.log(error)
        }
    }
}

module.exports= new CreateUser()
