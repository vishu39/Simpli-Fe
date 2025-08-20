import { environment } from "src/environments/environment";
const findMaxSimilarity = (
  input: string,
  targetArray: string[]
): { target: string; similarity: number; commonCharacters: string } | null => {
  let maxSimilarity = 0;
  let maxSimilarityObject: {
    target: string;
    similarity: number;
    commonCharacters: string;
  } | null = null;

  targetArray.forEach((target) => {
    const similarity = calculateSimilarityBetweenStrings(input, target);
    const commonCharacters = getCommonCharacters(input, target);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      maxSimilarityObject = { target, similarity, commonCharacters };
    }
  });

  return maxSimilarityObject;
};
const findMaxSimilarityForArrayOfObject = (
  input: string,
  targetArray: any
): { target: any; similarity: number; commonCharacters: string } | null => {
  let maxSimilarity = 0;
  let maxSimilarityObject: {
    target: string;
    similarity: number;
    commonCharacters: string;
  } | null = null;

  targetArray.forEach((target: any) => {
    const similarity = calculateSimilarityBetweenStrings(
      input.toLowerCase(),
      target?.name.toLowerCase()
    );
    const commonCharacters = getCommonCharacters(
      input.toLowerCase(),
      target?.name.toLowerCase()
    );

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      maxSimilarityObject = {
        target: target,
        similarity,
        commonCharacters,
      };
    }
  });

  return maxSimilarityObject;
};

const calculateSimilarityBetweenStrings = (
  str1: string,
  str2: string
): number => {
  const commonChars = getCommonCharacters(str1, str2);
  const totalChars = Math.max(str1.length, str2.length);

  return (commonChars.length / totalChars) * 100;
};

const getCommonCharacters = (str1: string, str2: string): string => {
  //   const set1 = new Set(str1);
  //   const set2 = new Set(str2);

  //   const intersection = new Set([...set1].filter((char) => set2.has(char)));

  //   return Array.from(intersection).join('');

  const charCountMap = new Map<string, number>();

  for (const char of str1) {
    charCountMap.set(char, (charCountMap.get(char) || 0) + 1);
  }

  const commonChars: string[] = [];
  for (const char of str2) {
    if (charCountMap.has(char) && charCountMap.get(char) > 0) {
      commonChars.push(char);
      charCountMap.set(char, charCountMap.get(char) - 1);
    }
  }

  return commonChars.join("");
};

export const GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING = (
  arrivedString: string,
  arrayOfStringData: any
) => {
  const stringSimilarityPercentage = environment.stringSimilarityPercentage;
  let matchedData: any;
  if (!!arrivedString) {
    matchedData = findMaxSimilarity(
      arrivedString?.toLowerCase(),
      arrayOfStringData
    );
  }

  return matchedData?.similarity >= stringSimilarityPercentage
    ? matchedData?.target
    : "";
};

export const GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ = (
  arrivedString: string,
  arrayOfStringData: any,
  type = ""
) => {
  const stringSimilarityPercentage = environment.stringSimilarityPercentage;
  let matchedData: any;
  if (!!arrivedString) {
    if (type === "currency") {
      matchedData = findMaxSimilarityCurrencyCodeForArrayOfObject(
        arrivedString?.toLowerCase(),
        arrayOfStringData
      );

      return matchedData?.similarity >= stringSimilarityPercentage
        ? matchedData?.target
        : "";
    }
    if (type === "addVil") {
      matchedData = findMaxSimilarityHospitalNameForArrayOfObject(
        arrivedString?.toLowerCase(),
        arrayOfStringData
      );
    } else {
      matchedData = findMaxSimilarityForArrayOfObject(
        arrivedString?.toLowerCase(),
        arrayOfStringData
      );
    }
  }

  if (type === "referralPartner" || type === "addVil" || type === "common") {
    return matchedData?.similarity >= stringSimilarityPercentage
      ? matchedData?.target
      : "";
  }

  if (type === "treatment") {
    return matchedData?.similarity >= stringSimilarityPercentage
      ? matchedData?.target?.name
      : "Other";
  }

  if (type === "embassy") {
    return matchedData?.similarity >= stringSimilarityPercentage
      ? matchedData?.target
      : "Other";
  } else {
    return matchedData?.similarity >= stringSimilarityPercentage
      ? matchedData?.target?.name
      : null;
  }
};

const findMaxSimilarityHospitalNameForArrayOfObject = (
  input: string,
  targetArray: any
): { target: any; similarity: number; commonCharacters: string } | null => {
  let maxSimilarity = 0;
  let maxSimilarityObject: {
    target: string;
    similarity: number;
    commonCharacters: string;
  } | null = null;

  targetArray.forEach((target: any) => {
    const similarity = calculateSimilarityBetweenStrings(
      input?.toLowerCase(),
      target?.hospitalName?.toLowerCase()
    );
    const commonCharacters = getCommonCharacters(
      input?.toLowerCase(),
      target?.hospitalName?.toLowerCase()
    );

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      maxSimilarityObject = {
        target: target,
        similarity,
        commonCharacters,
      };
    }
  });

  return maxSimilarityObject;
};

const findMaxSimilarityCurrencyCodeForArrayOfObject = (
  input: string,
  targetArray: any
): { target: any; similarity: number; commonCharacters: string } | null => {
  let maxSimilarity = 0;
  let maxSimilarityObject: {
    target: string;
    similarity: number;
    commonCharacters: string;
  } | null = null;

  targetArray.forEach((target: any) => {
    const similarity = newCalculateSimilarityBetweenStrings(
      input?.toLowerCase(),
      target?.code?.toLowerCase()
    );
    const commonCharacters = getNewCommonCharacters(
      input?.toLowerCase(),
      target?.code?.toLowerCase()
    );

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      maxSimilarityObject = {
        target: target,
        similarity,
        commonCharacters,
      };
    }
  });

  return maxSimilarityObject;
};

const calculateLevenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  // Initialize the matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const newCalculateSimilarityBetweenStrings = (
  str1: string,
  str2: string
): number => {
  const maxLen = Math.max(str1.length, str2.length);
  const distance = calculateLevenshteinDistance(str1, str2);

  // Similarity is inverse of distance
  return ((maxLen - distance) / maxLen) * 100;
};

const getNewCommonCharacters = (str1: string, str2: string): string => {
  const commonChars: string[] = [];

  let str2Index = 0; // Keep track of the current index in str2

  for (let i = 0; i < str1.length && str2Index < str2.length; i++) {
    if (str1[i] === str2[str2Index]) {
      commonChars.push(str1[i]); // Add the matching character
      str2Index++; // Move to the next character in str2
    }
  }

  return commonChars.join("");
};
