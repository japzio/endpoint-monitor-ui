<template>
  <div id="check-results">
    <h1>Check Results for</h1>
    <h2>Target {{ targetId }}</h2>
    <h2>Endpoint {{ endpoint }}</h2>
    <router-link to="/">Back to Targets</router-link>
    <div v-if="loading">Loading check results...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <table v-else>
      <thead>
        <tr>
          <th>Check ID</th>
          <th>Status</th>
          <th>Checked At</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in checkResults" :key="result.id">
          <td>{{ result.id }}</td>
          <td
            :style="{
              color:
                result.status === 'OK'
                  ? '#28a745'
                  : result.status === 'NOT_OK'
                    ? '#dc3545'
                    : '#fd7e14',
            }"
          >
            {{ result.status || 'Unknown' }}
          </td>
          <td>{{ new Date(result.createAt).toLocaleString() }}</td>
          <td>{{ result.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CheckResultsView',
  props: {
    targetId: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      checkResults: [],
      loading: false,
      error: null,
    }
  },
  async mounted() {
    await this.fetchCheckResults()
  },
  methods: {
    async fetchCheckResults() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(
          `http://localhost:8080/v1/monitor/targets/${this.targetId}/check-results?page=0&size=20&order=DESC`,
        )
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch check results`)
        const data = await response.json()
        this.checkResults = data.checkResults || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
#check-results {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}
a {
  display: inline-block;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th,
td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}
th {
  background: #f4f4f4;
}
.error {
  color: red;
  padding: 1rem;
  background: #ffe6e6;
  border: 1px solid red;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>
