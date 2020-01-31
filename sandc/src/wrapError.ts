import { ErrorWrapper } from "./types/errorWrapper";

export default function wrapError<T>(raw: T): ErrorWrapper<T> {
  return new ErrorWrapperImpl(raw);
}

class ErrorWrapperImpl<T> extends Error implements ErrorWrapper<T> {
  public readonly name: "ErrorWrapper";

  constructor(public readonly raw: T) {
    super();
    this.name = "ErrorWrapper";
  }
}
