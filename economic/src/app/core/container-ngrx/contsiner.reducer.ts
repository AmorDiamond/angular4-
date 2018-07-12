// src/app/core/pet-tag.reducer.ts
import { Action } from '@ngrx/store';
import { ContainerStyle, StyleInit } from './container.model';
import { CHANGE } from './container.action';

export function ContainerReducer(state: ContainerStyle = StyleInit, {type, payload}) {
  switch (type) {
    case CHANGE:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
