/* eslint-disable @typescript-eslint/no-explicit-any */
export type Indexable<T> = {[K in keyof T]?: any}
