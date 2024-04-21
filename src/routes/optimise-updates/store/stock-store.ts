import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { StockEvent } from "../../../utilities/stocks";
/**
 * Interface for store values
 * Store maintains a list of stock event IDs and a map of those records by ID
 * This allows us to maintain the ordering separately
 */
export type StockStoreValues = {
  ids: Array<StockEvent["id"]>;
  stockMap: Record<StockEvent["id"], StockEvent>;
  averagePrices: Array<{ value: number; label: number }>;
};

export type StockStoreActions = {
  add(event: StockEvent): void;
  reset(): void;
};

export type StockStoreType = StockStoreValues & StockStoreActions;

// Number of items to calculate average over
const batchSize = 50;

// Function to initialize stock store values
const getInitialValues = (): StockStoreValues => {
  return { ids: [], stockMap: {}, averagePrices: [] };
};

// Create a store for managing stock data
export const useStockStore = create(
  immer<StockStoreType>((set) => ({
    ...getInitialValues(),
    add(event) {
      set((store) => {
        // Add the new event to the store
        store.ids.push(event.id);
        store.stockMap[event.id] = event;

        // Calculate the sum of prices for the current batch
        const currentSum =
          (store.averagePrices.at(-1)?.value ?? 0) * store.averagePrices.length;
        const newSum =
          currentSum -
          (store.ids.length > batchSize
            ? store.stockMap[store.ids.at(-(batchSize + 1))!].price
            : 0) +
          event.price;
        if (store.averagePrices.length == batchSize) {
          store.averagePrices.shift();
        }

        // Calculate and store the new average price
        store.averagePrices.push({
          value: newSum / (store.averagePrices.length + 1),
          label: store.ids.length,
        });
      });
    },
    reset() {
      // Reset the store to its initial values
      set((store) => ({ ...store, ...getInitialValues() }));
    },
  }))
);
