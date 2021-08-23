class RequestHandler {
  constructor(db) {
    this.db = db;
  }

  async getMovies() {
    return this.db.getMovies();
  }

  async getRatings(userId) {
    return this.db.getRatings(userId);
  }

  async createMovie(record) {
    return this.db.createMovie(record);
  }

  async createUser(record) {
    const user = await this.db.createUser(record);
    return user;
  }

  async rateMovie(movieId, record) {
    const {
      userId,
      value,
    } = record;
    return this.db.createRating(movieId, userId, value);
  }

  async deleteMovie(id) {
    return this.db.deleteMovie(id);
  }
}

module.exports = RequestHandler;
