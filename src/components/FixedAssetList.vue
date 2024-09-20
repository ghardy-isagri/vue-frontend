<template>
  <v-container>
    <!-- Header Row -->
    <v-row>
      <v-col cols="12">
        <v-toolbar>
          <v-toolbar-title>Fixed Assets List</v-toolbar-title>
          <v-spacer />
          <v-btn class="btn-add" color="primary" @click="showAddModal">Add Fixed Asset</v-btn>
          <v-btn class="btn-refresh" color="primary" @click="refreshAssets">Refresh Assets</v-btn>
        </v-toolbar>
      </v-col>
    </v-row>

    <!-- Status Messages -->
    <v-row>
      <v-col cols="12">
        <!-- Loading state -->
        <v-alert v-if="loading" class="loading-alert" prominent type="info">
          Loading fixed assets...
        </v-alert>

        <!-- Error state -->
        <v-alert v-if="error" class="error-alert" prominent type="error">
          Error fetching data: {{ error.message }}
        </v-alert>

        <!-- No data found state -->
        <v-alert v-if="!loading && !fixedAssets.length" class="no-assets-alert" prominent type="info">
          No fixed assets found.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-row>
      <v-col cols="12">
        <v-data-table v-if="!loading && fixedAssets.length > 0" :headers="headers" item-key="id" :items="fixedAssets">
          <template #item="{ item }">
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.accountId }}</td>
              <td>{{ item.number }}</td>
              <td>{{ item.type || 'Unknown' }}</td>
              <td>{{ item.acquisitionType }}</td>
              <td>{{ item.acquisitionDate }}</td>
              <td>{{ item.acquisitionAmount }}</td>
              <td>{{ item.vatAmount }}</td>
              <td>{{ item.comments }}</td>
              <td>
                <v-btn class="btn-edit" color="primary" @click="updateFixedAsset(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn class="btn-delete" color="red" @click="deleteFixedAsset(item.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Modal for Add/Edit Fixed Asset -->
    <v-dialog v-model="dialogVisible" max-width="600px">
      <fixed-asset-form :fixed-asset="selectedAsset" @close="closeModal" />
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      color="deep-purple-accent-4"
      elevation="24"
      rounded="pill"
      :timeout="2000"
      vertical
    >
      <div class="text-subtitle-1 pb-2">Fixed Asset created or updated!</div>
      <p>{{ selectedAsset }}</p>
      <template #actions>
        <v-btn color="green" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
  import { computed, ref } from 'vue'
  import { useMutation, useQuery } from '@vue/apollo-composable'
  import gql from 'graphql-tag'
  import FixedAssetForm from './FixedAssetForm.vue'

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

  // GraphQL mutation to delete fixed assets
  const DELETE_FIXED_ASSET = gql`
  mutation DeleteFixedAsset($id: ID!) {
    deleteFixedAsset(id: $id) {
      id
    }
  }
`

  export default {
    name: 'FixedAssetsList',
    components: {
      FixedAssetForm,
    },
    setup () {
      const { result, loading, error, refetch } = useQuery(GET_FIXED_ASSETS)
      const { mutate: deleteAsset } = useMutation(DELETE_FIXED_ASSET)

      const snackbar = ref(false)
      const fixedAssets = computed(() => {
        return result.value?.getFixedAssets.map(asset => ({
          ...asset,
          acquisitionDate: new Date(parseInt(asset.acquisitionDate)).toLocaleDateString(),
        })) || []
      })

      const dialogVisible = ref(false)
      const selectedAsset = ref(null)

      function showAddModal () {
        selectedAsset.value = null
        dialogVisible.value = true
      }

      function updateFixedAsset (asset) {
        selectedAsset.value = asset
        dialogVisible.value = true
      }

      function deleteFixedAsset (id) {
        deleteAsset({ id })
          .then(() => {
            console.log(`Fixed asset ${id} deleted successfully`)
            refetch()
          })
          .catch(error => {
            console.error('Error deleting Fixed Asset:', error)
          })
      }

      function refreshAssets () {
        refetch()
      }

      function closeModal () {
        dialogVisible.value = false
        snackbar.value = true
        refreshAssets()
      }

      const headers = [
        { title: 'ID', value: 'id', align: 'center' },
        { title: 'Name', value: 'name', align: 'center' },
        { title: 'Account ID', value: 'accountId', align: 'center' },
        { title: 'Number', value: 'number', align: 'center' },
        { title: 'Type', value: 'type', align: 'center' },
        { title: 'Acquisition Type', value: 'acquisitionType', align: 'center' },
        { title: 'Acquisition Date', value: 'acquisitionDate', align: 'center' },
        { title: 'Acquisition Amount', value: 'acquisitionAmount', align: 'center' },
        { title: 'VAT Amount', value: 'vatAmount', align: 'center' },
        { title: 'Comments', value: 'comments', align: 'center' },
        { title: 'Actions', value: 'actions', align: 'center' },
      ]

      return {
        loading,
        error,
        fixedAssets,
        dialogVisible,
        selectedAsset,
        snackbar,
        headers,
        showAddModal,
        updateFixedAsset,
        deleteFixedAsset,
        refreshAssets,
        closeModal,
      }
    },
  }
</script>
