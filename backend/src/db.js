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

  async createMovie(record) {
    console.info(
      `adding movie ${JSON.stringify(record)}`,
    );
    return this.sql.models.movie.create(record);
  }

  async deleteMovie(id) {
    return this.sql.models.movie.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = Db;
