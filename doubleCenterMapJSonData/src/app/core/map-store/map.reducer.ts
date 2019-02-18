import { ADDPARKMARK, ADDENTERPRISEMARK, CLEARMARK } from "./map.actions";
import { MapStore, MapStoreInit } from "./map.model";
export function mapReducer (state: MapStore = MapStoreInit, {type, payload}) {
  switch (type) {
    case ADDPARKMARK:
      return Object.assign({}, state, payload);
    case ADDENTERPRISEMARK:
      return Object.assign({}, state, payload);
    case CLEARMARK:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
