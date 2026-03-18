export const ALL_GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const normalizeSelectedGens = (value: unknown): number[] => {
  if (!Array.isArray(value)) {
    return [...ALL_GENERATIONS];
  }

  const normalized = Array.from(
    new Set(
      value.filter(
        (gen): gen is number =>
          Number.isInteger(gen) &&
          gen >= ALL_GENERATIONS[0] &&
          gen <= ALL_GENERATIONS[ALL_GENERATIONS.length - 1]
      )
    )
  ).sort((left, right) => left - right);

  return normalized.length > 0 ? normalized : [...ALL_GENERATIONS];
};

export const areGenerationListsEqual = (left: number[], right: number[]): boolean => {
  return left.length === right.length && left.every((value, index) => value === right[index]);
};

export const areAllGenerationsSelected = (selectedGens: number[]): boolean => {
  return areGenerationListsEqual(normalizeSelectedGens(selectedGens), [...ALL_GENERATIONS]);
};
