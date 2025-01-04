export const generateUniqueId = (): string => {
  return 'device-' + Math.random().toString(36).substr(2, 9);
}; 