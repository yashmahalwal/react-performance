import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { StockEvent } from "../../../utilities/stocks";

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

const batchSize = 50;

const getInitialValues = (): StockStoreValues => {
  return { ids: [], stockMap: {}, averagePrices: [] };
};

export const useStockStore = create(
  immer<StockStoreType>((set) => ({
    ...getInitialValues(),
    add(event) {
      set((store) => {
        store.ids.push(event.id);
        store.stockMap[event.id] = event;

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

        store.averagePrices.push({
          value: newSum / (store.averagePrices.length + 1),
          label: store.ids.length,
        });
      });
    },
    reset() {
      set((store) => ({ ...store, ...getInitialValues() }));
    },
  }))
);
