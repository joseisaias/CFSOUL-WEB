export const loading = {
  state: {
    refCount: 0,
    isLoading: false
  },
  mutations: {
    loading (state, isLoading) {
      if (isLoading) {
        state.refCount++
        state.isLoading = true
      } else if (state.refCount > 0) {
        state.refCount--
        state.isLoading = (state.refCount > 0)
      }
    }
  }
}
