export const isValidNumber = (input: string): boolean => /^\d+$/.test(input);
export const isValidTitle = (input: string): boolean =>
  /^[a-zA-Z0-9_\-]+$/.test(input);
export const isValidURL = (input: string): boolean =>
  input === '' || /^(https?:\/\/\S+)$/.test(input);
