import { Card, CpuLevel, Selection } from '@/types';
import lodash from 'lodash';

const probability: { [key in CpuLevel]: number } = {
  weak: 0.2,
  normal: 0.5,
  strong: 1,
};

const randomInt = (end: number) => Math.floor(Math.random() * end);
const getRandomElement = <T>(array: Array<T>) => array[randomInt(array.length)];
const isPaird = (card0: Card, card1: Card) =>
  card0.status.code === card1.status.code;

const createSelections = (curSelections: Selection[], selection: Selection) =>
  lodash.union(curSelections, [selection]);
const createRemoved = (removed: boolean[], selection: Selection) =>
  removed.map((r, index) => {
    if (index === selection.first || index === selection.second) {
      return true;
    } else {
      return r;
    }
  });

const decide = (
  curSelections: Selection[],
  fieldCards: Card[],
  known: boolean[],
  removed: boolean[],
  pLimit: number,
  selectableKnownPair: boolean,
): Selection[] => {
  const existIndexs = lodash
    .range(0, fieldCards.length)
    .filter((index) => !removed[index]);
  if (existIndexs.length === 0) {
    return curSelections;
  } else if (existIndexs.length === 2) {
    return createSelections(curSelections, {
      first: existIndexs[0],
      second: existIndexs[1],
    });
  }

  // 4枚以上存在

  const existKnownIndexMap = new Map<number, number[]>();
  existIndexs.forEach((ei) => {
    if (known[ei]) {
      const code = fieldCards[ei].status.code;
      existKnownIndexMap.set(
        code,
        existKnownIndexMap.get(code)
          ? lodash.union(existKnownIndexMap.get(code), [ei])
          : [ei],
      );
    }
  });
  const existKnownIndexPairs: Selection[] = [...existKnownIndexMap.values()]
    .filter((v) => v.length === 2)
    .map((v) => ({ first: v[0], second: v[1] }));
  const existKnownIndexs = existIndexs.filter((ei) => known[ei]);
  const existUnknownIndexs = existIndexs.filter((ei) => !known[ei]);

  if (existKnownIndexs.length === 0) {
    // すべて未知のカード
    // ランダムに2枚選択
    const shuffledExistUnknownIndexs = lodash.shuffle(existUnknownIndexs);
    const selection = {
      first: shuffledExistUnknownIndexs[0],
      second: shuffledExistUnknownIndexs[1],
    };
    const paired = isPaird(
      fieldCards[selection.first],
      fieldCards[selection.second],
    );

    // ペアならば続行
    const newSelections = createSelections(curSelections, selection);
    if (paired) {
      const newRemoved = createRemoved(removed, selection);
      return decide(
        newSelections,
        fieldCards,
        known,
        newRemoved,
        pLimit,
        false,
      );
    } else {
      return newSelections;
    }
  } else if (existUnknownIndexs.length === 0) {
    // すべて既知のカード
    if (selectableKnownPair && Math.random() < pLimit) {
      // ペアを選択
      const selection = getRandomElement(existKnownIndexPairs);
      const newSelections = createSelections(curSelections, selection);
      const newRemoved = createRemoved(removed, selection);
      return decide(newSelections, fieldCards, known, newRemoved, pLimit, true);
    } else {
      // わざと外す
      const shuffledExistKnownIndexPairs = lodash.shuffle(existKnownIndexPairs);
      const selection = {
        first: shuffledExistKnownIndexPairs[0].first,
        second: shuffledExistKnownIndexPairs[1].first,
      };
      const newSelections = createSelections(curSelections, selection);
      return newSelections;
    }
  } else {
    // 未知のカードと既知のカードの混合
    if (
      selectableKnownPair &&
      existKnownIndexPairs.length &&
      Math.random() < pLimit
    ) {
      // 既知のカードからペアを選択
      const selection = getRandomElement(existKnownIndexPairs);
      const newSelections = createSelections(curSelections, selection);
      const newRemoved = createRemoved(removed, selection);
      return decide(newSelections, fieldCards, known, newRemoved, pLimit, true);
    } else {
      // 未知のカードから1枚選択
      const first = getRandomElement(existUnknownIndexs);
      const mapValue = existKnownIndexMap.get(fieldCards[first].status.code);

      if (mapValue !== undefined) {
        // 相方は既知
        if (Math.random() < pLimit) {
          const selection = {
            first,
            second: mapValue[0],
          };
          const newSelections = createSelections(curSelections, selection);
          const newRemoved = createRemoved(removed, selection);

          return decide(
            newSelections,
            fieldCards,
            known,
            newRemoved,
            pLimit,
            false,
          );
        } else {
          // わざと外す
          const second = getRandomElement(
            lodash.without(existIndexs, mapValue[0]),
          );
          const selection = { first, second };
          const newSelections = createSelections(curSelections, selection);
          return newSelections;
        }
      } else {
        // 相方は未知
        const second = getRandomElement(
          lodash.without(existUnknownIndexs, first),
        );
        const selection = { first, second };
        const paired = isPaird(fieldCards[first], fieldCards[second]);

        // ペアならば続行
        const newSelections = createSelections(curSelections, selection);
        if (paired) {
          const newRemoved = createRemoved(removed, selection);
          return decide(
            newSelections,
            fieldCards,
            known,
            newRemoved,
            pLimit,
            false,
          );
        } else {
          return newSelections;
        }
      }
    }
  }
};

export const decideSelections = (
  fieldCards: Card[],
  known: boolean[],
  removed: boolean[],
  level: CpuLevel,
): Selection[] => {
  return decide([], fieldCards, known, removed, probability[level], true);
};
