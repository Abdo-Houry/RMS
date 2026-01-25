import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Language = "ar" | "en"
export type Direction = "rtl" | "ltr"

interface LanguageState {
  currentLanguage: Language
  direction: Direction
}

const initialState: LanguageState = {
  currentLanguage: "ar",
  direction: "rtl",
}

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload
      state.direction = action.payload === "ar" ? "rtl" : "ltr"
    },
  },
})
export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
