<template>
  <div>
    <h2>Fixed Assets List</h2>

    <!-- Refresh Button -->
    <button @click="refreshAssets">Refresh Assets</button>

    <!-- Loading state -->
    <div v-if="loading">Loading fixed assets...</div>

    <!-- Error state -->
    <div v-if="error">Error fetching data: {{ error.message }}</div>

    <!-- No data found state -->
    <div v-if="!loading && !fixedAssets.length">No fixed assets found.</div>

    <!-- Table of fixed assets -->
    <table v-if="!loading && fixedAssets.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Account ID</th>
          <th>Number</th>
          <th>Type</th>
          <th>Acquisition Type</th>
          <th>Acquisition Date</th>
          <th>Acquisition Amount</th>
          <th>VAT Amount</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asset in fixedAssets" :key="asset.id">
          <td>{{ asset.id }}</td>
          <td>{{ asset.name }}</td>
          <td>{{ asset.accountId }}</td>
          <td>{{ asset.number }}</td>
          <td>{{ asset.type || 'Unknown' }}</td>
          <td>{{ asset.acquisitionType }}</td>
          <td>{{ asset.acquisitionDate }}</td>
          <td>{{ asset.acquisitionAmount }}</td>
          <td>{{ asset.vatAmount }}</td>
          <td>{{ asset.comments }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue'
  import { useQuery } from '@vue/apollo-composable'
  import gql from 'graphql-tag'

  // GraphQL query to fetch fixed assets
  const GET_FIXED_ASSETS = gql`
  query GetFixedAssets {
    getFixedAssets {
      id
      name
      accountId
      number
      type
      acquisitionType
      acquisitionDate
      acquisitionAmount
      vatAmount
      comments
    }
  }
`

  export default {
    refetch () {
      // Use Apollo's useQuery to fetch fixed assets
      const { result, loading, error } = useQuery(GET_FIXED_ASSETS)

      // Reactive ref for the fixed assets data
      const fixedAssets = ref([])

      // Watch for changes in the result and update the fixedAssets array
      if (result) {
        fixedAssets.value = result.value?.getFixedAssets || []
      }

      return {
        fixedAssets,
        loading,
        error// Make refresh function available to the template
      }
    },
    setup () {
      // Use Apollo's useQuery to fetch fixed assets
      const { result, loading, error, refetch } = useQuery(GET_FIXED_ASSETS)

      // Reactive ref for the fixed assets data
      const fixedAssets = ref([])

      console.log(result)
      console.log(result.value?.getFixedAssets)
      // Watch for changes in the result and update the fixedAssets array
      if (result) {
        fixedAssets.value = result.value?.getFixedAssets || []
      }

      // Function to refresh (refetch) the fixed assets when the button is clicked
      const refreshAssets = () => {
        refetch()
      }

      return {
        fixedAssets,
        loading,
        error,
        refreshAssets, // Make refresh function available to the template
      }
    },
  }
</script>
