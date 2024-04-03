import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { StockEvent } from "../../../utilities/stocks";

export type StockEventWithIndex = StockEvent & { index: number };

export type StockStoreValues = {
  ids: Array<StockEvent["id"]>;
  stockMap: Record<StockEvent["id"], StockEventWithIndex>;
  averagePrices: Array<{ value: number; label: number }>;
};

export type StockStoreActions = {
  add(event: StockEvent): void;
  reset(): void;
};

export type StockStoreType = StockStoreValues & StockStoreActions;

const batchSize = 50;
const storageLimit = 200;

const getInitialValues = (): StockStoreValues => {
  return { ids: [], stockMap: {}, averagePrices: [] };
};

export const useStockStore = create(
  immer<StockStoreType>((set) => ({
    ...getInitialValues(),
    add(event) {
      set((store) => {
        const lastId = store.ids.at(-1);
        const index =
          lastId && lastId in store.stockMap
            ? store.stockMap[lastId].index + 1
            : store.ids.length;
        store.stockMap[event.id] = { ...event, index };
        store.ids.push(event.id);

        if (store.ids.length > storageLimit) {
          for (let i = 0; i < storageLimit / 2; i++) {
            delete store.stockMap[store.ids[i]];
          }

          store.ids = store.ids.slice(storageLimit / 2, -1);
        }

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
          label: index,
        });
      });
    },
    reset() {
      set((store) => ({ ...store, ...getInitialValues() }));
    },
  }))
);
