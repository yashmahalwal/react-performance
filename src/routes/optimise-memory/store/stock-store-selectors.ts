import { StockEvent } from "../../../utilities/stocks";
import { StockStoreType } from "./stock-store";

/**
 * See {@link "../../optimise-updates/store/stock-store-selectors"}
 */

export const selectAdd = (store: StockStoreType) => store.add;
export const selectReset = (store: StockStoreType) => store.reset;
export const selectIds = (store: StockStoreType) => store.ids;
export const selectAveragePrices = (store: StockStoreType) =>
  store.averagePrices;
export const selectStockEvent = (store: StockStoreType, id: StockEvent["id"]) =>
  store.stockMap[id];
