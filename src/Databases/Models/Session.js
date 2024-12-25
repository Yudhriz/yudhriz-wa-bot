const { DataTypes } = require("sequelize");
const BaseModel = require("../../Structures/BaseModel");

class Session extends BaseModel {
  static attributes = {
    sessionId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qr: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    credentials: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  };
}

module.exports = Session;
