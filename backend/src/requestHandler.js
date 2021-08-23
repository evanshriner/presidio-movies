class RequestHandler {
  constructor(db) {
    this.db = db;
  }

  async getMovies(email) {
    const movies = await this.db.getMovies();
    if (!email) {
      return movies;
    }
    const ratings = await this.db.getRatings(email);
    const returnArray = [];
    movies.forEach((movie) => {
      ratings.forEach((rating) => {
        if (rating.movieId === movie.id) {
          returnArray.push({
            ...movie.get({ plain: true }),
            rating: rating.value,
          });
        }
      });
    });
    return returnArray;
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
