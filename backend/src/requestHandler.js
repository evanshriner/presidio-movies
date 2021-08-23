class RequestHandler {
  constructor(db) {
    this.db = db;
  }

  async getMovies() {
    return this.db.getMovies();
  }
}

module.exports = RequestHandler;
