<template>
  <div id="targets">
    <h1>Endpoint Monitor</h1>

    <!-- Form to add new target -->
    <div class="form-group">
      <h2>Add New Target</h2>
      <input v-model="newTarget.endpoint" placeholder="Endpoint URL (e.g., https://example.com)" />
      <select v-model="newTarget.method">
        <option value="" disabled>Select Method</option>
        <option value="CURL">CURL</option>
        <option value="PING">PING</option>
        <option value="TELNET">TELNET</option>
      </select>
      <label><input type="checkbox" v-model="newTarget.enabled" /> Enabled</label>
      <button @click="addTarget" :disabled="loading">Add Target</button>
      <div v-if="formError" class="error">{{ formError }}</div>
    </div>

    <!-- Targets table -->
    <h2>Monitored Targets</h2>
    <div v-if="loading">Loading targets...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Endpoint</th>
          <th>Method</th>
          <th>Created At</th>
          <th>Is Enabled</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="target in targets" :key="target.id">
          <td>{{ target.id }}</td>
          <td>{{ target.endpoint }}</td>
          <td>{{ target.method }}</td>
          <td>{{ new Date(target.createdAt).toLocaleString() }}</td>
          <td>{{ target.enabled }}</td>
          <td>
            <router-link
              :to="{
                name: 'CheckResults',
                params: { targetId: target.id, endpoint: target.endpoint },
              }"
            >
              View Check Results
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TargetsView',
  data() {
    return {
      newTarget: {
        endpoint: '',
        method: '',
        enabled: true,
      },
      targets: [],
      loading: false,
      error: null,
      formError: null,
    }
  },
  async mounted() {
    await this.fetchTargets()
  },
  methods: {
    async fetchTargets() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(
          'http://localhost:8080/v1/monitor/targets?page=0&size=20&order=DESC',
        )
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch targets`)
        const data = await response.json()
        this.targets = data.targets || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async addTarget() {
      if (!this.newTarget.endpoint || !this.newTarget.method) {
        this.formError = 'Endpoint and method are required'
        return
      }
      this.loading = true
      this.formError = null
      try {
        const response = await fetch('http://localhost:8080/v1/monitor/targets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newTarget),
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to add target`)
        this.newTarget = { endpoint: '', method: '', enabled: true }
        await this.fetchTargets()
      } catch (err) {
        this.formError = err.message
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
#targets {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}
.form-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}
input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}
button,
a {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
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
h2 {
  margin-top: 2rem;
}
</style>
