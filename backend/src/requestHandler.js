class RequestHandler {
  constructor(db) {
    this.db = db;
  }

  async getMovies() {
    return this.db.getMovies();
  }

  async getRatings(email) {
    return this.db.getRatings(email);
  }

  async createMovie(record) {
    return this.db.createMovie(record);
  }

  async rateMovie(movieId, record) {
    const {
      email,
      value,
    } = record;
    return this.db.createRating(movieId, email, value);
  }

  async deleteMovie(id) {
    return this.db.deleteMovie(id);
  }
}

module.exports = RequestHandler;
