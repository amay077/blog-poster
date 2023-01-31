import { Gen, Operator, Seq } from "leseq";

export const chunkWithSkip = <T>(size: number, skipCount: number): Operator<T, readonly T[]> =>
  function* chunk(source: Seq<T>): Gen<readonly T[]> {
    let ch: T[] = [];
    const s = source.toArray();
    for (let i = 0; i < s.length; i++) {
      const one = s[i];
      ch.push(one);
      if (ch.length === size) {
        yield ch;
        i = i - (size - skipCount);
        ch = [];
      }
    }    if (ch.length != 0) {
      yield ch;
    }
  };
