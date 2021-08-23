const { Sequelize } = require('sequelize');
const models = require('./models');

class Db {
  constructor() {
    this.sql = new Sequelize({
      dialect: 'sqlite',
      storage: './movies.db',
      query: { raw: true },
    });

    models.initalizeModels(this.sql);
  }

  async authenticate() {
    await this.sql.authenticate();
  }

  async getUserByEmail(email) {
    return (await this.sql.models.user.findAll({
      where: {
        email,
      },
    }))[0];
  }

  async getMovies() {
    return this.sql.models.movie.findAll();
  }

  async getRatings(email) {
    const user = await this.getUserByEmail(email);
    return this.sql.models.rating.findAll({
      where: {
        userId: user.id,
      },
    });
  }

  async createMovie(record) {
    return this.sql.models.movie.create(record);
  }

  async createRating(movieId, email, value) {
    const user = await this.getUserByEmail(email);

    const rating = (await this.sql.models.rating.findAll({
      where: {
        movieId,
        userId: user.id,
      },
    }))[0];

    await this.sql.models.rating.upsert({
      movieId,
      userId: user.id,
      value,
      ...(rating && {
        id: rating.id,
      }),
    });
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
