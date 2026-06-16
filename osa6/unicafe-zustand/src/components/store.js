import { create } from 'zustand'

const useReviewStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    addGood: () => set(state => ({ good: state.good + 1 })),
    addNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    addBad: () => set(state => ({ bad: state.bad + 1 })),
  }
}))

export const useGood = () => useReviewStore(state => state.good)
export const useNeutral = () => useReviewStore(state => state.neutral)
export const useBad = () => useReviewStore(state => state.bad)
export const useCounterControls = () => useReviewStore(state => state.actions)
