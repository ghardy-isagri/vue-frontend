import { mount } from '@cypress/vue'
import FixedAssetsList from '../../src/components/FixedAssetList.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
})

describe('Fixed Assets List Component', () => {
  beforeEach(() => {
    const mockAssets = [
      {
        id: '1',
        name: 'Building A',
        accountId: 101,
        number: 123,
        type: 'Building',
        acquisitionType: 'Cash',
        acquisitionDate: new Date().getTime().toString(),
        acquisitionAmount: 500000,
        vatAmount: 10000,
        comments: 'Test Building',
      },
      // Add more mock assets if needed
    ]
    cy.intercept('GET', 'http://localhost:9090/', req => {
      if (req.body.operationName === 'GetFixedAssets') {
        req.reply({
          statusCode: 200,
          body: { data: { getFixedAssets: mockAssets } },
        })
      }
    }).as('fetchAssets')


    mount(FixedAssetsList, {
      global: {
        plugins: [vuetify],
      },
    })
  })

  it('should show loading state while fetching data', () => {
    // Simulate loading state
    mount(FixedAssetsList, {
      global: {
        plugins: [vuetify],
      },
      data () {
        return {
          loading: true,
          fixedAssets: [],
          error: null,
        }
      },
    })

    cy.get('.loading-alert').should('contain.text', 'Loading fixed assets...')
  })

  it('should show error state if fetching data fails', () => {
    mount(FixedAssetsList, {
      global: {
        plugins: [vuetify],
      },
    })
    cy.intercept('GET', 'http://localhost:9090/', {
      statusCode: 500,
      body: { errors: [{ message: 'Server Error' }] },
    }).as('fetchError')
    cy.wait('@fetchError') // Wait for the error to be intercepted
    cy.get('.error-alert').should('contain.text', 'Error fetching data: Response not successful: Received status code 500')
  })

  it('should display a message if no fixed assets are found', () => {
    mount(FixedAssetsList, {
      global: {
        plugins: [vuetify],
      },
      data () {
        return {
          loading: false,
          fixedAssets: [],
          error: null,
        }
      },
    })
    cy.get('.no-assets-alert').should('contain.text', 'No fixed assets found.')
  })

  it('should display fixed assets in the data table', () => {
    cy.wait('@fetchAssets') // Wait for the assets to be fetched

    cy.get('.v-data-table tbody tr').should('have.length.greaterThan', 0)
    cy.get('.v-data-table tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain.text', '1')
      cy.get('td').eq(1).should('contain.text', 'Building A')
      cy.get('td').eq(2).should('contain.text', '101')
      cy.get('td').eq(3).should('contain.text', '123')
      cy.get('td').eq(4).should('contain.text', 'Building')
      cy.get('td').eq(5).should('contain.text', 'Cash')
      cy.get('td').eq(6).should('contain.text', new Date().toLocaleDateString())
      cy.get('td').eq(7).should('contain.text', '500000')
      cy.get('td').eq(8).should('contain.text', '10000')
      cy.get('td').eq(9).should('contain.text', 'Test Building')
    })
  })

  it('should open the add modal when the Add button is clicked', () => {
    cy.get('.btn-add').click()
    cy.get('.v-dialog').should('be.visible')
  })

  it('should open the edit modal when an Edit button is clicked', () => {
    const mockAssets = [
      {
        id: '1',
        name: 'Building A',
        accountId: 101,
        number: 123,
        type: 'Building',
        acquisitionType: 'Cash',
        acquisitionDate: new Date().getTime().toString(),
        acquisitionAmount: 500000,
        vatAmount: 10000,
        comments: 'Test Building',
      },
      // Add more mock assets if needed
    ]
    mount(FixedAssetsList, {
      global: {
        plugins: [vuetify],
      },
      data () {
        return {
          loading: false,
          fixedAssets: mockAssets,
          error: null,
        }
      },
    })

    cy.get('.v-data-table tbody tr').first().within(() => {
      cy.get('.btn-edit').click() // Click the edit button
    })

    cy.get('.v-dialog').should('be.visible')
  })
})
