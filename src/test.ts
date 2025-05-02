import { decomposeHangul, composeHangul } from './utils/korean';

const words = ["내루미", "또궤앓", "걔걔", "각", "가", "A", "ㅂ"];

for (const word of words) {
  for (const char of word) {
    const jamo = decomposeHangul(char);
    const recomposed = composeHangul(jamo);
    const isSame = char === recomposed;

    console.log(`'${char}' → ${jamo.join(' ')} → '${recomposed}' → ${isSame ? 'OK' : 'Mismatch'}`);
  }
}
