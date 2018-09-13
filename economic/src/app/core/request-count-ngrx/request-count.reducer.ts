// src/app/core/pet-tag.reducer.ts
import { Action } from '@ngrx/store';
import { RequestCount, RequestCountInit } from './request-count.model';
import { CHANGECOUNT } from './request-count.action';

export function RequestCountReducer(state: RequestCount = RequestCountInit, {type, payload}) {
  switch (type) {
    case CHANGECOUNT:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
