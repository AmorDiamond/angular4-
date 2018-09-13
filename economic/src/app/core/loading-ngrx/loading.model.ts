export class LoadingShow {
  constructor(
    public show: boolean,
    public requestTimes?: number,
  ) { }
}

export const ShowInit: LoadingShow = {
  show: false,
  requestTimes: 0,
};
