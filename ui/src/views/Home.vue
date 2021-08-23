<template>
  <v-content
    fluid
    grid-list-md
    text-xs-center
  >
    <v-layout
      justify-center
    >
      <v-flex>
        <v-container
          grid-list-lg
          justify-space-around
          justify-space-between
          align-content-start
        >
          <v-layout
            row
            wrap
            justify-center
            justify-space-around
            justify-space-between
            align-content-start
          >
            <v-flex
              v-for="(movie) in movies"
              :key="movie.id"
              xs12
              lg4
              sm5
              justify-space-around
              justify-space-between
              align-content-start
            >
              <v-hover>
                <v-card
                  slot-scope="{ hover }"
                  color="white"
                  hover
                  raised
                >
                  <v-img
                    :src="movie.image"
                    height="200px"
                  />
                  <v-card-title
                    v-if="movie.title.length > 0"
                    primary-title
                  >
                    <span><h3>{{ movie.title }}</h3></span>
                  </v-card-title>
                  <v-card-text>
                    <span>{{ movie.cast_crew }}</span>
                  </v-card-text>
                  <v-card-text>
                    <span class="italic">Release Date: {{ movie.release_date }}</span>
                  </v-card-text>
                  <v-card-text class="items-center">
                    <star-rating
                      :rating="movie.rating"
                      increment="0.5"
                      star-size="30"
                      glow="3"
                      @rating-selected="rateMovie($event, movie.id)"
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />

                    <v-btn
                      v-if="!hover && !inMenu"
                      text
                      icon
                      color="transparent"
                      small
                    >
                      <v-icon>touch_app</v-icon>
                    </v-btn>

                    <div v-else>
                      <v-menu top>
                        <v-btn
                          v-if="$auth.isAuthenticated && $auth.isAdmin"
                          slot="activator"
                          text
                          icon
                          color="red"
                          small
                          @click="deleteMovie(movie.id)"
                        >
                          <v-icon>movie</v-icon>
                        </v-btn>
                      </v-menu>
                    </div>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-btn
      v-if="$auth.isAuthenticated && $auth.isAdmin"
      fab
      dark
      large
      color="primary"
      fixed
      right
      bottom
    >
      <v-icon
        dark
        @click="addMovie"
      >
        add
      </v-icon>
    </v-btn>
  </v-content>
</template>

<script>
import axios from 'axios';
import StarRating from 'vue-star-rating';
import config from '../app.config';

export default {
  name: 'Home',
  components: {
    StarRating,
  },
  data() {
    return {
      movies: null,
      ratings: null,
      user: null,
      inMenu: false,
      isMenu: false,
    };
  },
  async mounted() {
    this.user = await this.refreshUser();
    this.ratings = await this.getRatings();
    this.movies = await this.getMovies();
    this.joinMovieRatings();
  },

  methods: {
    joinMovieRatings() {
      this.movies.forEach((movie) => {
        this.ratings.forEach((rating) => {
          if (rating.movieId === movie.id) {
            // eslint-disable-next-line no-param-reassign
            movie.rating = rating.value;
          }
        });
      });
    },
    async getMovies() {
      return (await this.get(`${config.SERVER_HOST}/movies`)).data;
    },
    async refreshUser() {
      return (await this.post(`${config.SERVER_HOST}/users`, {
        email: this.$auth.user.email,
      })).data;
    },
    async getRatings() {
      return (await this.get(`${config.SERVER_HOST}/ratings/${this.user.id}`)).data;
    },
    async deleteMovie(id) {
      const token = await this.$auth.getTokenSilently();
      await axios.delete(`${config.SERVER_HOST}/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.movies = this.movies.filter((movie) => movie.id !== id);
    },
    async rateMovie(value, id) {
      await this.post(
        `${config.SERVER_HOST}/movies/${id}/rate`,
        {
          userId: this.user.id,
          value,
        },
      );
    },
    async get(url) {
      const token = await this.$auth.getTokenSilently();
      return axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    async post(url, body) {
      const token = await this.$auth.getTokenSilently();
      return axios.post(
        url,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    },
    addMovie() {
      this.$router.push({ name: 'Add' });
    },

  },
};
</script>
