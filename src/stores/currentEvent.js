import { defineStore } from 'pinia'

export const useCurrentEventStore = defineStore('currentEvent', {
  state: () => ({
    currentEventId: null,
    currentEventData: null
  }),
  getters: {
    getEvent: (state) => state.currentEventData,
    // ou se quiser garantir que só retorna se estiver selecionado:
    // getEvent: (state) => state.currentEventId ? state.currentEventData : null
  },  
  actions: {
    setEvent(event) {
      this.currentEventId = event.id
      this.currentEventData = event
    },
    clearEvent() {
      this.currentEventId = null
      this.currentEventData = null
    }
  },
  // pinia-plugin-persistedstate deve estar instalado e configurado 
  persist: true   
})
