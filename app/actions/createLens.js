export const SAVE_LENS = 'SAVE_LENS';

export function saveLens(details) {
  return {
    type: SAVE_LENS,
    payload: details
  };
}