// TODO: This is not used properly.
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
