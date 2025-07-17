import { defineStore } from 'pinia'

export const useCurrentEventStore = defineStore('currentEvent', {
  state: () => ({
    currentEvent: null
  }),
  getters: {
    getEvent: (state) => state.currentEvent,
  },  
  actions: {
    setEvent(event) {
      this.currentEvent = event
    },
    clearEvent() {
      this.currentEvent = null
    }
  },
  persist: true // torna persistente mesmo após reload
})
