// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmptyObject = (obj: any): boolean => {
  return !Object.keys(obj).length;
};
