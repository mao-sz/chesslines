export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
