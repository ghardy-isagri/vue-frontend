<template>
  <div>
    <h1>Item List</h1>
    <ul>
      <li v-for="item in items" :key="item._id">{{ item.name }}: {{ item.value }}</li>
    </ul>
    <input v-model="newItem.name" placeholder="Name">
    <input v-model="newItem.value" placeholder="Value">
    <button @click="addItem">Add Item</button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import { createItem, getItems } from '../services/api'

  export default defineComponent({
    setup () {
      const items = ref<any[]>([])
      const newItem = ref({ name: '', value: '' })

      const fetchItems = async () => {
        try {
          const response = await getItems()
          items.value = response.data
        } catch (error) {
          console.error('Error fetching items:', error)
        }
      }

      const addItem = async () => {
        try {
          await createItem(newItem.value)
          newItem.value = { name: '', value: '' }
          fetchItems()
        } catch (error) {
          console.error('Error creating item:', error)
        }
      }

      onMounted(() => {
        fetchItems()
      })

      return { items, newItem, addItem }
    },
  })
</script>

<style scoped>
/* Add your styles here */
</style>
