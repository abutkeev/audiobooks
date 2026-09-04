import { createAction } from '@reduxjs/toolkit';

/**
 * Kept out of the store module so that slices can be imported without building the store.
 */
export function getSliceActionCreator(slice: { name: string }) {
  return function <T = undefined>(name: string) {
    return createAction<T>(`${slice.name}/${name}`);
  };
}
