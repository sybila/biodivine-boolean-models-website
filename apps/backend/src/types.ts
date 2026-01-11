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

export function errResponse(message: string): ApiResponse<any> {
    return {
        status: 'failure',
        error: message,
    };
}
