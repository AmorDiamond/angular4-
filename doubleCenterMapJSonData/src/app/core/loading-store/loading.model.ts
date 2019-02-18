class LoadingStore {
  constructor(
    public status: Boolean,
    public fullStatus: Boolean
  ) {}
}
const InitLoading: LoadingStore = {
  status: false,
  fullStatus: false
}
export { InitLoading, LoadingStore }
