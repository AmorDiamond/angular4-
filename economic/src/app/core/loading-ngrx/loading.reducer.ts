// src/app/core/pet-tag.reducer.ts
import { Action } from '@ngrx/store';
import { LoadingShow, ShowInit } from './loading.model';
import { CHANGE } from './loading.action';

export function LoadingReducer(state: LoadingShow = ShowInit, {type, payload}) {
  switch (type) {
    case CHANGE:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
