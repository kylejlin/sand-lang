export default function nullableToTuple<T>(nullable: T | null): [T] | [] {
  if (nullable === null) {
    return [];
  } else {
    return [nullable];
  }
}
