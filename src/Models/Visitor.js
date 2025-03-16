import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database.js';

class Visitor extends Model {}

Visitor.init({
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_visit: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    visit_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    user_agent: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Visitor',
    tableName: 'visitors',
    timestamps: true,
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
    paranoid: true,
    version: false,
    underscored: true,
});

export default Visitor;
