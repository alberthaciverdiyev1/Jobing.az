import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database';

class Visitor extends Model {}

Visitor.init({
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastVisit: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    visitCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    userAgent: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Visitor',
    tableName: 'visitors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    version: false,
    underscored: true,
});

export default Visitor;
