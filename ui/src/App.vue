<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1
          @click="home"
        >
          Presidio Movies
        </h1>
      </div>

      <v-spacer />

      <v-btn
        v-if="$auth.isAuthenticated"
        class="blue darken-4"
        @click="logout"
      >
        <span>Logout</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  methods: {
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
    home() {
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>
