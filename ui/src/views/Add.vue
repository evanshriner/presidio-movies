<template>
  <v-form>
    <h2 class="text-center mt-5">
      Add a Movie
    </h2>
    <v-container>
      <v-row>
        <v-text-field
          v-model="form.title"
          :counter="20"
          label="Title"
          required
        />
      </v-row>
      <v-row>
        <v-textarea
          v-model="form.plot"
          label="Plot"
          required
        />
      </v-row>
      <v-row>
        <v-text-field
          v-model="form.cast_crew"
          label="Cast and Crew"
          optional
        />
      </v-row>
      <v-row>
        <v-select
          v-model="form.genre"
          :items="genres"
          label="Genre"
          required
        />
      </v-row>
      <v-row>
        <v-text-field
          v-model="form.language"
          label="Language"
          required
        />
      </v-row>
      <v-row>
        <v-text-field
          v-model="form.image"
          label="Image URL"
          required
        />
      </v-row>
      <v-btn
        :disabled="!formIsValid"
        text
        color="primary"
        type="submit"
        @click="submitMovie"
      >
        Create
      </v-btn>
    </v-container>
  </v-form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Add',
  data() {
    return {
      form: {
        title: null,
        plot: null,
        cast_crew: null,
        genre: null,
        language: null,
        image: null,
      },
      genres: [
        'Horror',
        'Comedy',
        'Drama',
        'Adam Sandler Movie',
        'Documentary',
      ],
    };
  },
  computed: {
    formIsValid() {
      return (
        this.form.title
          && this.form.plot
          && this.form.genre
          && this.form.language
          && this.form.image
      );
    },
  },

  methods: {
    async submitMovie() {
      const token = await this.$auth.getTokenSilently();
      await axios.post(
        'http://localhost:8000/movies',
        {
          ...this.form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>
