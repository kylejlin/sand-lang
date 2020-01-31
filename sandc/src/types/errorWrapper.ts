export interface ErrorWrapper<T> extends Error {
  readonly raw: T;
  readonly name: "ErrorWrapper";
}
