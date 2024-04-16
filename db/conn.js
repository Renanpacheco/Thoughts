const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts','root','',{
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('connection established')
}catch(err) {
    console.log('connection error: ' + err)
}

module.exports = sequelize