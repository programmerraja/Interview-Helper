
export function shuffleArray(array, endIndex = 10) {
  if (!array || !array.length) return [];
  
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, endIndex);
}


export function removeDuplicates(array) {
  if (!array || !array.length) return [];
  return [...new Set(array)];
}


export function filterArrayBySearchTerm(array, searchTerm) {
  if (!array || !array.length || !searchTerm) return array;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return array.filter(item => 
    typeof item === 'string' && item.toLowerCase().includes(lowerCaseSearchTerm)
  );
}
