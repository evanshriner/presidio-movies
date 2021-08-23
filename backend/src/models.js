const { DataTypes } = require('sequelize');

const models = [
  {
    modelName: 'user',
    attributes: {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      email: {
        type: DataTypes.TEXT,
      },
    },
  },
  {
    modelName: 'movie',
    attributes: {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
      },
      plot: {
        type: DataTypes.TEXT,
      },
      cast_crew: {
        type: DataTypes.TEXT,
      },
      genre: {
        type: DataTypes.TEXT,
      },
      release_date: {
        type: DataTypes.TEXT,
      },
      language: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.TEXT,
      },
    },
  },
];

class Models {
  static initalizeModels(sql) {
    models.forEach((model) => {
      sql.define(model.modelName, model.attributes);
    });
  }
}

module.exports = Models;
