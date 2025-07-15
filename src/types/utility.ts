import type { Dispatch, SetStateAction } from 'react';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type StateSetter<T> = Dispatch<SetStateAction<T>>;
export type NonEmptyArray<T> = [T, ...T[]];

type FontAwesomeIconName =
    | 'trash'
    | 'pencil'
    | 'folder-plus'
    | 'check'
    | 'xmark'
    | 'plus'
    | 'forward-step'
    | 'forward-fast'
    | 'backward-step'
    | 'backward-fast'
    | 'plus'
    | 'caret-down'
    | 'caret-right';
export type FontAwesomeIcon = `fa-solid fa-${FontAwesomeIconName}`;
