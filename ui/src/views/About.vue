<template>
  <div>
    <button @click="callApi">
      Click this Bad Boy
    </button>
    <p>{{ apiMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default ({
  data() {
    return {
      apiMessage: '',
    };
  },
  methods: {
    async callApi() {
      const token = await this.$auth.getTokenSilently();
      // Use Axios to make a call to the API
      const { data } = await axios.get('http://localhost:8000/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.apiMessage = data;
    },
  },
});
</script>
