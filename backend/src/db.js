const { Sequelize } = require('sequelize');
const models = require('./models');

class Db {
  constructor() {
    this.sql = new Sequelize({
      dialect: 'sqlite',
      storage: './movies.db',
    });

    models.initalizeModels(this.sql);
  }

  async authenticate() {
    await this.sql.authenticate();
  }

  async getMovies() {
    return this.sql.models.movie.findAll();
  }
}

module.exports = Db;
