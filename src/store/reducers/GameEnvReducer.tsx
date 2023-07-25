import { createSlice } from "@reduxjs/toolkit";

const MAX_LOGS = 50;

const initialState = Object.freeze({
  gameObjectIndexer: 0,
  logs: [],
});

const GameEnvSlice = createSlice({
  name: "GameEnv",
  initialState,
  reducers: {
    incrementGameObjectIndexer: (state) => {
      state.gameObjectIndexer++;
    },
    addLog: (state: any, action) => {
      state.logs.push(action.payload);
      if (state.logs.length > MAX_LOGS) state.logs.shift();
    },
  },
});

export const { incrementGameObjectIndexer, addLog } = GameEnvSlice.actions;
export const gameEnvSlice = (state: any) => state;
export const gameObjectIndexer = (state: any) => state.GameEnv.gameObjectIndexer;
export default GameEnvSlice.reducer;
