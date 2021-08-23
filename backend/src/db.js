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

  async getMovies() {
    return this.sql.models.movie.findAll();
  }

  async getRatings(userId) {
    return this.sql.models.rating.findAll({
      where: {
        userId,
      },
    });
  }

  async createMovie(record) {
    return this.sql.models.movie.create(record);
  }

  async createUser(record) {
    const user = await this.sql.models.user.findOne({
      where: {
        email: record.email,
      },
    });
    if (!user) {
      return this.sql.models.user.create(record, {
        returning: true,
      });
    }
    return user;
  }

  async createRating(movieId, userId, value) {
    const rating = (await this.sql.models.rating.findAll({
      where: {
        movieId,
        userId,
      },
    }))[0];

    await this.sql.models.rating.upsert({
      movieId,
      userId,
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
