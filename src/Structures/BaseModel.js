const { Model } = require("sequelize");

class BaseModel extends Model {
  static init(sequelize) {
    return super.init(this.attributes, {
      sequelize,
      tableName: this.name.toLowerCase(), // Nama tabel default adalah nama class
    });
  }
}

module.exports = BaseModel;
