const { DataTypes } = require("sequelize");
const BaseModel = require("../../Structures/BaseModel");

class State extends BaseModel {
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
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  };
}

module.exports = State;
