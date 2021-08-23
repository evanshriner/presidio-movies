class RequestHandler {
  constructor(db) {
    this.db = db;
  }

  async getMovies() {
    return this.db.getMovies();
  }

  async createMovie(record) {
    return this.db.createMovie(record);
  }

  async deleteMovie(id) {
    return this.db.deleteMovie(id);
  }
}

module.exports = RequestHandler;
