import { combineReducers } from '@reduxjs/toolkit';
import notesReducer from './notes-slice';
const rootReducer = combineReducers({
  notes: notesReducer,
});

export default rootReducer;
