export class RequestCount {
  constructor(
    public requestTimes: number,
  ) { }
}

export const RequestCountInit: RequestCount = {
  requestTimes: 0,
};
