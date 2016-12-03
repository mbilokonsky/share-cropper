export const SAVE_DATASET = 'SAVE_DATASET';

export function saveDataset(details) {
  return {
    type: SAVE_DATASET,
    payload: details
  };
}