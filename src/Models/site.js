import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';
const Site = sequelize.define('Site', {
    url:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    icon:{
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    deletedAt:{
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
},
    {
        tableName: 'sites',
        timestamps: true,
    });
export default Site;
