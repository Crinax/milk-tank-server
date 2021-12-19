export type IAPIResponse = {
  code: number,
  status: string,
};

export type IAPIError = {
  message: string,
} & APIResponse;

export type IAPISuccess = {
  data?: any;
} & APIResponse;

export default class APIResponse {
  constructor(
    public code: number,
    public status: string,
    public message?: string,
    public data?: any,
  ) {}

  static error(code: number, message: string) {
    return new APIResponse(code, 'error', message);
  }

  static ok(data?: any) {
    return new APIResponse(200, 'ok', undefined, data);
  }
}