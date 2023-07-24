import { createSlice } from "@reduxjs/toolkit";

const initialState = Object.freeze({
  gameObjectIndexer: 0,
});

const GameEnvSlice = createSlice({
  name: "GameEnv",
  initialState,
  reducers: {
    incrementGameObjectIndexer: (state) => {
      state.gameObjectIndexer++;
    },
  },
});

export const { incrementGameObjectIndexer } = GameEnvSlice.actions;
export const gameEnvSlice = (state: any) => state;
export const gameObjectIndexer = (state: any) => state.GameEnv.gameObjectIndexer;
export default GameEnvSlice.reducer;
