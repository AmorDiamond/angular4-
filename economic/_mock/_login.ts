import { MockRequest, MockStatusError } from '@delon/mock';

export const LOGIN = {
  'POST /login': { responseCode: '_200' },
  // 发送 Status 错误
  '/404': () => {
    throw new MockStatusError(404);
  },
};