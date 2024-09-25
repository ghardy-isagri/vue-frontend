<template>
  <v-container>
    <v-card class="pa-5" elevation="5">
      <v-card-title class="headline">{{ formTitle }}</v-card-title>

      <v-form ref="form" v-model="formValid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.name"
              label="Name"
              required
              :rules="[rules.required]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.accountId"
              label="Account ID"
              required
              :rules="[rules.required, rules.number]"
              type="number"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.number"
              label="Asset Number"
              required
              :rules="[rules.required, rules.number]"
              type="number"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="formData.type"
              item-title="text"
              item-value="value"
              :items="assetTypes"
              label="Asset Type"
              required
              :rules="[rules.required]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="formData.acquisitionType"
              item-title="text"
              item-value="value"
              :items="acquisitionTypes"
              label="Acquisition Type"
              required
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.acquisitionDate"
              label="Acquisition Date"
              required
              :rules="[rules.required]"
              type="date"
            /> </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.acquisitionAmount"
              label="Acquisition Amount"
              required
              :rules="[rules.required, rules.number]"
              type="number"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.vatAmount"
              label="VAT Amount"
              required
              :rules="[rules.required, rules.number]"
              type="number"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formData.comments"
              label="Comments"
              :rows="3"
            />
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :disabled="!formValid" @click="submitForm">
            Submit
          </v-btn>
          <v-btn color="secondary" @click="resetForm">
            Reset
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, watch } from 'vue'
  import { provideApolloClient, useMutation } from '@vue/apollo-composable'
  import gql from 'graphql-tag'
  import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'

  const httpLink = new HttpLink({
    uri: 'http://localhost:9090/', // Replace with your GraphQL server URL
  })
  const cache = new InMemoryCache()
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  })
  provideApolloClient(apolloClient)

  export default defineComponent({
    name: 'FixedAssetForm',
    props: {
      fixedAsset: {
        type: Object,
        default: () => null,
      },
    },
    emits: ['close'],
    setup (props, { emit }) {
      const formValid = ref(false)
      const returnedFixedAsset = ref('')

      const formData = reactive({
        id: '',
        name: '',
        accountId: '',
        number: '',
        type: null,
        acquisitionType: null,
        acquisitionDate: '', // Store as a Unix timestamp
        acquisitionAmount: '',
        vatAmount: '',
        comments: '',
      })

      watch(
        () => props.fixedAsset,
        newAsset => {
          if (newAsset) {
            Object.assign(formData, newAsset)
          }
        },
        { immediate: true }
      )

      const formTitle = ref(props.fixedAsset ? 'Edit Fixed Asset' : 'Create Fixed Asset')

      const assetTypes = [
        { text: 'Autres', value: 'AUTRES' },
        { text: 'Bâtiments', value: 'BATIMENTS' },
        { text: 'Matériels', value: 'MATERIELS' },
        { text: 'Parts', value: 'PARTS' },
        { text: 'Prêts, Dépôts, Cautions', value: 'PRETS_DEPOTS_CAUTIONS' },
      ]

      const acquisitionTypes = [
        { text: 'Cash', value: 'CASH' },
        { text: 'Credit', value: 'CREDIT' },
        { text: 'Lease', value: 'LEASE' },
      ]

      const rules = {
        required: (v: string) => !!v || 'This field is required',
        number: (v: string) => !isNaN(parseFloat(v)) || 'Must be a number',
      }

      const CREATE_FIXED_ASSET_MUTATION = gql`
        mutation CreateFixedAsset($data: CreateFixedAssetInput!) {
          createFixedAsset(data: $data) {
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

      const UPDATE_FIXED_ASSET_MUTATION = gql`
        mutation UpdateFixedAsset($data: UpdateFixedAssetInput!) {
          updateFixedAsset(data: $data) {
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

      const { mutate: createFixedAsset } = useMutation(CREATE_FIXED_ASSET_MUTATION)
      const { mutate: updateFixedAsset } = useMutation(UPDATE_FIXED_ASSET_MUTATION)
      const submitForm = () => {
        console.log(formData.acquisitionDate)
        if (formValid.value) {
          const formattedData = {
            ...formData,
            acquisitionDate: formData.acquisitionDate
              ? new Date(formData.acquisitionDate).toISOString() // Convert to ISO string format
              : undefined, // Ensure undefined if no date is provided
            accountId: parseInt(formData.accountId, 10),
            number: parseInt(formData.number, 10),
            acquisitionAmount: parseFloat(formData.acquisitionAmount),
            vatAmount: parseFloat(formData.vatAmount),
          }

          if (formData.id) {
            updateFixedAsset({ data: formattedData })
              .then(response => {
                returnedFixedAsset.value = `Asset updated: ${response?.data.updateFixedAsset.name}`
                emit('close')
                resetForm()
              })
              .catch(error => {
                console.error('Error updating Fixed Asset:', error)
              })
          } else {
            // Remove the `id` field before sending the data for creation
            const { id, ...createData } = formattedData

            // If there is no id, perform a create
            createFixedAsset({ data: createData })
              .then(response => {
                returnedFixedAsset.value = `Asset created: ${response?.data.createFixedAsset.name}`
                emit('close')
                resetForm()
              })
              .catch(error => {
                console.error('Error creating Fixed Asset:', error)
              })
          }
        }
      }

      const resetForm = () => {
        Object.assign(formData, {
          id: '',
          name: '',
          accountId: '',
          number: '',
          type: null,
          acquisitionType: null,
          acquisitionDate: '',
          acquisitionAmount: '',
          vatAmount: '',
          comments: '',
        })
      }

      return {
        formValid,
        returnedFixedAsset,
        formData,
        assetTypes,
        acquisitionTypes,
        rules,
        submitForm,
        resetForm,
        formTitle,
      }
    },
  })
</script>

<style scoped>
.v-dialog__content {
  max-width: 75%;
  margin: auto;
}
</style>
