// src/app/core/pet-tag.reducer.ts
import { Action } from '@ngrx/store';
import { ADD_MARKER, ADD_MARKER_MID, REMOVE_MARKER, OPEN_INFO, CLOSE_INFO, CLEAR_MARKER, ADD_POLYGON, ADD_BUILD_MARKER } from './amap.actions';
import { Amap, AmapInit } from './amap.model';

export function amapReducer(state: Amap = AmapInit, {type, payload}) {
  switch (type) {
    case ADD_MARKER:
      return Object.assign({}, state, payload);
    case ADD_MARKER_MID:
      return Object.assign({}, state, payload);
    case REMOVE_MARKER:
      return Object.assign({}, state, payload);
    case CLEAR_MARKER:
      return Object.assign({}, state, payload);
    case OPEN_INFO:
      return Object.assign({}, state, payload);
    case CLOSE_INFO:
      return Object.assign({}, state, payload);
    case ADD_POLYGON:
      return Object.assign({}, state, payload);
    case ADD_BUILD_MARKER:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
