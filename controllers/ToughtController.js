const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController{
    
    static async showToughts(req, res){
        const toughtsData = await Tought.findAll({include: User,})

        const toughts= toughtsData.map((result) => result.get({plain: true}))
        res.render('toughts/home', {toughts})
    }

    static async dashboard(req, res){

        const userId = req.session.userid;

        const user = await User.findOne({
        where: {
            id: userId,
        },
        include: [Tought],
        plain: true,
        })

        if(!user){
            res.redirect('/login')
        }
        
        const toughts = user.Toughts.map((result) => result.dataValues);

        res.render('toughts/dashboard',{ toughts})

    }

    static async removeTought(req, res) {
        const idTought = req.body.id
        const UserId = req.session.userid

        try {
            await Tought.destroy({where: {id: idTought, userId: UserId}})
            req.flash('message', 'Thought removed with sucess!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
            
        } catch (error) {
            console.log(error)
            
        }

    }


    static createTought(req, res){
        res.render('toughts/create')
    }
    static async createToughtSave(req, res){
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        Tought.create(tought)
        .then(() => {
            req.flash('message', 'Thought create with sucess!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        })
        .catch((err) => console.log())
        
    }
    
    static async updateTought(req, res) {
        
        const id = req.params.id
        const tought = await Tought.findOne({ where: { id: id }, raw: true})

        res.render('toughts/edit', { tought })
    }

    static async updateToughtSave(req, res) {
        
        const id = req.body.id
        const tought = {title: req.body.title}

        try {
            await Tought.update(tought, { where:{ id: id }})
            req.flash('message', 'Edit thought with sucess!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }

    
}