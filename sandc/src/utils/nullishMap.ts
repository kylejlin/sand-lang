export default function nullishMap<T, U>(
  val: T | null,
  mapper: (start: T) => U,
): U | null;
export default function nullishMap<T, U>(
  val: T | undefined,
  mapper: (start: T) => U,
): U | undefined;
export default function nullishMap<T, U>(
  val: T | null | undefined,
  mapper: (start: T) => U,
): U | null | undefined;

export default function nullishMap<T, U>(
  val: T | null | undefined,
  mapper: (start: T) => U,
): U | null | undefined {
  if (val === null || val === undefined) {
    return val as null | undefined;
  } else {
    return mapper(val);
  }
}
