const { DataTypes } = require("sequelize");
const BaseModel = require("../../Structures/BaseModel");

class Menu extends BaseModel {
  static attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    menu: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  };
}

module.exports = Menu;
