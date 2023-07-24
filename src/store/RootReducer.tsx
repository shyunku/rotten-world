import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/es/storage";
import GameEnvReducer from "./reducers/GameEnvReducer";

const persistConfig = {
  key: "root",
  storage: storage,
};

const RootReducer = combineReducers({
  GameEnv: GameEnvReducer,
});

export default persistReducer(persistConfig, RootReducer);
