import { AsyncLocalStorage } from "node:async_hooks";
import type { Context } from "@hono/hono";

// Define the store structure
type RequestStore = {
  context: Context;
  data: Map<string, unknown>;
};

// Create the AsyncLocalStorage instance
const asyncLocalStorage = new AsyncLocalStorage<RequestStore>();

/**
 * Middleware to initialize the request store
 */
export const initRequestStore = (
  c: Context,
  next: () => Promise<unknown>,
) => {
  // Create a new store for this request
  const store: RequestStore = {
    context: c,
    data: new Map<string, unknown>(),
  };

  // Run the next middleware with this store
  return asyncLocalStorage.run(store, async () => {
    return await next();
  });
};

/**
 * Get the current request context
 */
export const getCurrentContext = (): Context | null => {
  const store = asyncLocalStorage.getStore();
  return store?.context || null;
};

/**
 * Store API for the current request
 */
export type StoreApi = {
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, value: T) => void;
  getOrCreate: <T>(key: string, factory: () => Promise<T>) => Promise<T>;
  remove: (key: string) => boolean;
  clear: () => void;
};

/**
 * Create a store API for the current request
 */
export const createStoreApi = (): StoreApi => {
  const store = asyncLocalStorage.getStore();

  if (!store) {
    throw new Error(
      "Request store not available. Did you add the initRequestStore middleware?",
    );
  }

  const dataMap = store.data;

  return {
    get: <T>(key: string): T | undefined => dataMap.get(key) as T,
    set: <T>(key: string, value: T): void => dataMap.set(key, value),
    getOrCreate: async <T>(
      key: string,
      factory: () => Promise<T>,
    ): Promise<T> => {
      if (dataMap.has(key)) {
        return dataMap.get(key) as T;
      }
      const value = await factory();
      dataMap.set(key, value);
      return value;
    },
    remove: (key: string): boolean => dataMap.delete(key),
    clear: (): void => dataMap.clear(),
  };
};

/**
 * Get the store API for the current request
 * This is a convenience function that throws if the store is not available
 */
export const useStore = (): StoreApi => {
  return createStoreApi();
};
