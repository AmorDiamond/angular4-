export class LoadingLayer {
  constructor(
    public status: boolean,
  ) { }
}

export const loadingLayerInit: LoadingLayer = {
  status: false
};
