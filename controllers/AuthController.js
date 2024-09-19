const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class ToughtController{
    static login(req, res){
        res.render('auth/login')
    }
    
    static async loginPost(req, res){
        const {email, password} = req.body

        //find the user
        const user = await User.findOne({where: {email: email}})
        if(!user){
            req.flash('message', 'This e-mail dont exist')
            res.render('auth/login')
            return
        }
        //password match
        const passwordMatch = bcrypt.compareSync(password, user.password)
        if(!passwordMatch){
            req.flash('message', 'invalid password')
            res.render('auth/login')
            return
        }
        // login success
        req.session.userid = user.id
        req.session.save(()=>{
            res.redirect('/')
        })
    }


    static register(req, res){
        res.render('auth/register')
    }

    static async registerPost(req, res){
        const {name,email,password,confirmpassword} = req.body
        //password match validation
        /*if(password !== '' && confirmpassword !== ''){}*/

        if(confirmpassword != password){
            req.flash('message', 'password mismatch, try again')
            res.render('auth/register')
            
            return
        }
        //check if user exits
        const checIfUserExists = await User.findOne({ where: { email: email}})

        if(checIfUserExists){
            req.flash('message', 'This e-mail alredy exist')
            res.render('auth/register')
            
            return
        }
        // create a password
        let salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        const user ={
            name,
            email,
            password: hashedPassword
        }
        try {
            const createdUser= await User.create(user)
            req.flash('message','success registred user')
            req.session.userid = createdUser.id
            req.session.save(()=>{
                res.redirect('/')
            })
            
        } catch (error) {
            console.error(error)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

}