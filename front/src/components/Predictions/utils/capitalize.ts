export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 

export function capitalizeEachWord(str: string) {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}