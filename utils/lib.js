// Pulls out IDs from an array of objects
exports.getIds = (array = []) => {
  return array.map((object) => object.id);
};

exports.convertCamelCaseToSentence = (camelCaseWord) => {
  // Replace all occurrences of capital letters with a space followed by the same letter in lowercase
  const spacedWord = camelCaseWord.replace(/([A-Z])/g, " $1");
  // Capitalize the first letter of the resulting string
  const capitalizedSentence =
    spacedWord.charAt(0).toUpperCase() + spacedWord.slice(1);
  return capitalizedSentence.trim(); // Remove leading/trailing whitespace
};
