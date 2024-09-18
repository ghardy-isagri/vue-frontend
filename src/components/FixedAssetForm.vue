<template>
  <div>
    <h2>Create or Update Fixed Asset</h2>

    <!-- Form to input Fixed Asset data -->
    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div class="form-group">
        <label for="name">Asset Name:</label>
        <input
          id="name"
          v-model="fixedAsset.name"
          placeholder="Enter asset name"
          required
          type="text"
        >
      </div>

      <!-- Account ID -->
      <div class="form-group">
        <label for="accountId">Account ID:</label>
        <input
          id="accountId"
          v-model="fixedAsset.accountId"
          placeholder="Enter account ID"
          required
          type="number"
        >
      </div>

      <!-- Number -->
      <div class="form-group">
        <label for="number">Number:</label>
        <input
          id="number"
          v-model="fixedAsset.number"
          placeholder="Enter asset number"
          required
          type="number"
        >
      </div>

      <!-- Asset Type -->
      <div class="form-group">
        <label for="type">Asset Type:</label>
        <select id="type" v-model="fixedAsset.type" required>
          <option v-for="type in assetTypes" :key="type.value" :value="type.value">
            {{ type.text }}
          </option>
        </select>
      </div>

      <!-- Acquisition Type -->
      <div class="form-group">
        <label for="acquisitionType">Acquisition Type:</label>
        <select id="acquisitionType" v-model="fixedAsset.acquisitionType" required>
          <option v-for="type in acquisitionTypes" :key="type.value" :value="type.value">
            {{ type.text }}
          </option>
        </select>
      </div>

      <!-- Acquisition Date -->
      <div class="form-group">
        <label for="acquisitionDate">Acquisition Date:</label>
        <input id="acquisitionDate" v-model="fixedAsset.acquisitionDate" required type="date">
      </div>

      <!-- Acquisition Amount -->
      <div class="form-group">
        <label for="acquisitionAmount">Acquisition Amount:</label>
        <input
          id="acquisitionAmount"
          v-model="fixedAsset.acquisitionAmount"
          placeholder="Enter acquisition amount"
          required
          type="number"
        >
      </div>

      <!-- VAT Amount -->
      <div class="form-group">
        <label for="vatAmount">VAT Amount:</label>
        <input id="vatAmount" v-model="fixedAsset.vatAmount" placeholder="Enter VAT amount" type="number">
      </div>

      <!-- Comments -->
      <div class="form-group">
        <label for="comments">Comments:</label>
        <textarea id="comments" v-model="fixedAsset.comments" placeholder="Enter comments (optional)" />
      </div>

      <!-- Submit Button -->
      <div class="form-group">
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue'
  import { useMutation } from '@vue/apollo-composable'
  import gql from 'graphql-tag'

  // Mutation for creating a fixed asset
  const CREATE_FIXED_ASSET = gql`
  mutation CreateFixedAsset($data: CreateFixedAssetInput!) {
    createFixedAsset(data: $data) {
      id
      name
      acquisitionAmount
    }
  }
`

  export default {
    setup () {
      // Reactive form data for FixedAsset
      const fixedAsset = ref({
        name: '',
        accountId: 0,
        number: 1,
        type: null,
        acquisitionType: 0,
        acquisitionDate: '',
        acquisitionAmount: 0,
        vatAmount: 0,
        comments: '',
      })

      // Asset Type options
      const assetTypes = [
        { text: 'Autres', value: 0 },
        { text: 'Bâtiments', value: 1 },
        { text: 'Matériels', value: 2 },
        { text: 'Parts', value: 3 },
        { text: 'Prêts, Dépôts, Cautions', value: 4 },
      ]

      // Acquisition Type options
      const acquisitionTypes = [
        { text: 'Cash', value: 0 },
        { text: 'Credit', value: 1 },
        { text: 'Lease', value: 2 },
      ]

      // Mutation hook for creating a fixed asset
      const { mutate: createFixedAsset } = useMutation(CREATE_FIXED_ASSET)

      // Function to submit the form
      const submitForm = async () => {
        try {
          // Call the mutation and pass form data as variables
          await createFixedAsset({
            variables: {
              data: {
                ...fixedAsset.value,
                acquisitionAmount: parseFloat(fixedAsset.value.acquisitionAmount.toString()), // Ensure it's a number
                vatAmount: parseFloat(fixedAsset.value.vatAmount.toString()), // Ensure it's a number
              },
            },
          })
          alert('Fixed Asset created successfully!')
        } catch (error) {
          console.error('Error creating Fixed Asset:', error)
          alert('Failed to create Fixed Asset.')
        }
      }

      return {
        fixedAsset,
        assetTypes,
        acquisitionTypes,
        submitForm,
      }
    },
  }
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
