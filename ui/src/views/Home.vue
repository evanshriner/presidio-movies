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
                  <v-rating
                    empty-icon="$mdiStarOutline"
                    full-icon="$mdiStar"
                    half-icon="$mdiStarHalfFull"
                    hover
                    length="5"
                    size="33"
                    value=3
                  />
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

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      movies: null,
      inMenu: false,
      isMenu: false,
    };
  },
  async created() {
    const token = await this.$auth.getTokenSilently();
    const { data } = await axios.get('http://localhost:8000/movie', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.movies = data;
  },

  methods: {
    async deleteMovie(id) {
      const token = await this.$auth.getTokenSilently();
      await axios.delete(`http://localhost:8000/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.movies = this.movies.filter((movie) => movie.id !== id);
    },
    addMovie() {
      this.$router.push({ name: 'Add' });
    },
  },
};
</script>
