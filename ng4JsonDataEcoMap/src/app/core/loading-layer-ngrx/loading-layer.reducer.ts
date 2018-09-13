// src/app/core/pet-tag.reducer.ts
import { Action } from '@ngrx/store';
import { CHANGE_LOADING } from './loading-layer.actions';
import { LoadingLayer, loadingLayerInit } from './loading-layer.model';

export function loadingLayerReducer(state: LoadingLayer = loadingLayerInit, {type, payload}) {
  switch (type) {
    case CHANGE_LOADING:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
