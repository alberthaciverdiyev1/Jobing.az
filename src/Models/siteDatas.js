import { DataTypes } from "sequelize";
import sequelize from '../Config/database.js';
const siteDatas = sequelize.define('siteDatas',{
    siteId:{
        type:DataTypes.STRING,
        allowNull: false
    },
    companyId:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:null
    },
    companyName :{
        type:DataTypes.STRING,
        defaultValue:null
    },
    isExpired:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    isNew:{
        type:DataTypes.BOOLEAN,
        defaultValue:true  
    },
    startedAt:{
        type:DataTypes.DATE,
        defaultValue:null
    },
    expiredAt:{
        type:DataTypes.DATE,
        defaultValue:null
    },
    deletedAt:{
        type:DataTypes.DATE,
        defaultValue:null
    }
},{
    tableName: 'siteDatas',
    timestamps: true
});

export default siteDatas;