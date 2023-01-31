import { load } from "js-yaml";
import { from } from "leseq";
import { chunkWithSkip } from "./leseq-ext";

export function parse(text: string): { length: number, data: any } | undefined {
  const sepalator = '---';
  const buf = from(text).pipe(chunkWithSkip(3, 1)).toArray();
  let started = false;
  let startPos = -1;
  let endPos = -1;
  let i = 0;
  for (const b of buf) {
    const line = b.join('');
    if (!started) {
      if (line.startsWith(sepalator)) {
        started = true;
        startPos = i + 3;
      }
    } else {
      if (line.startsWith(sepalator)) {
        endPos = i;
        break;
      }
    }
    i++;
  }
  const ymlStr = text.substring(startPos, endPos);
  const data = load(ymlStr) as any;
  return { length: endPos + 4, data };
}
