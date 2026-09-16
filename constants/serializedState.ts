export interface AsyncKeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface SerializedState<T> {
  getCurrent(): T;
  replace(next: T, persist: (next: T) => Promise<void>): Promise<T>;
  update(
    reducer: (current: T) => T,
    persist: (next: T) => Promise<void>,
  ): Promise<T>;
}

export function createSerializedState<T>(initial: T): SerializedState<T> {
  let current = initial;
  let queue: Promise<void> = Promise.resolve();

  const enqueue = (operation: () => Promise<T>): Promise<T> => {
    const result = queue.then(operation, operation);
    queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  };

  return {
    getCurrent: () => current,
    replace: (next, persist) =>
      enqueue(async () => {
        await persist(next);
        current = next;
        return current;
      }),
    update: (reducer, persist) =>
      enqueue(async () => {
        const next = reducer(current);
        await persist(next);
        current = next;
        return current;
      }),
  };
}
