export type ApiResponse<T> =
    | {
          status: 'success';
          data: T;
          message: string;
      }
    | {
          status: 'failure';
          error: string;
      };

export function errResponse(message: string): ApiResponse<unknown> {
    return {
        status: 'failure',
        error: message,
    };
}
