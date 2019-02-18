import { CHANGE } from "./loading.actions";
import { LoadingStore, InitLoading } from "./loading.model";
export function LoadingReducer (state: LoadingStore = InitLoading, {type, payload}) {
  switch (type) {
    case CHANGE:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
