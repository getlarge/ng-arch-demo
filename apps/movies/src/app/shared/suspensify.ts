import {
  catchError,
  map,
  Observable,
  of,
  OperatorFunction,
  retry,
  RetryConfig,
  startWith,
} from 'rxjs';

export interface Suspensify<T> {
  error: Error | undefined;
  suspense: boolean;
  data: T;
}

export const suspensify = <T>(
  initialValue: T,
  retryConfig: RetryConfig = { count: 2, delay: 1000 },
): OperatorFunction<T, Suspensify<T>> => {
  return (o$: Observable<T>) => {
    return o$.pipe(
      map((data) => {
        return {
          data, // data: data
          suspense: false,
          error: undefined,
        };
      }),
      startWith({
        suspense: true,
        error: undefined,
        data: initialValue,
      }),
      retry(retryConfig),
      catchError((error) => {
        console.log('an error was thrown', error);
        return of({
          error: error,
          suspense: false,
          data: initialValue,
        });
      }),
    );
  };
};
