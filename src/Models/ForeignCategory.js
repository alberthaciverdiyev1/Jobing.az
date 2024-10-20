import { DataTypes } from 'sequelize';
import sequelize from '../Config/Database.js';
import Enums from '../Config/Enums.js';

const ForeignCategory = sequelize.define('ForeignCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false
    },
    websiteId:{
        type:DataTypes.STRING(Enums.SitesWithId),
        allowNull:true
    }
}, {
    tableName: 'foreignCategory',
    timestamps: true,
    paranoid: true,
});


export default ForeignCategory;
