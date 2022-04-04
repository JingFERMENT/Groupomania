const { Sequelize } = require("sequelize");
const db = require ("../config/database");

const User = db.define ("user", {

    firstName : {
        type: DataTypes.STRING, 
        allowNull: false
    },

    lastName : {
        type: DataTypes.STRING, 
        allowNull: false
    }, 

    email : {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    password : {
        type: DataTypes.STRING, 
        allowNull: false
    },

    photoUrl : DataTypes.STRING, 

    jobtitle : DataTypes.STRING, 
     

})

module.exports = User;