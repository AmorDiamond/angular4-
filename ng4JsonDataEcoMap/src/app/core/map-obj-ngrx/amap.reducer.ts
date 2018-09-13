// src/app/core/pet-tag.reducer.ts
import { Action } from '@ngrx/store';
import { SAVE_MAP } from './amap.actions';
import { gaodeAmap, gaodeAmapInit } from './amap.model';

export function amapReducer2(state: gaodeAmap = gaodeAmapInit, {type, payload}) {
  switch (type) {
    case SAVE_MAP:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
