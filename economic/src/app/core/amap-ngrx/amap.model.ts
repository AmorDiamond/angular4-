export class Amap {
  constructor(
    public action: string,
    public data: object,
  ) { }
}

export const AmapInit: Amap = {
  action: '',
  data: {}
};
