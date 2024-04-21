import { StockEvent } from "../../../utilities/stocks";
import { StockStoreType } from "./stock-store";

/**
 * Selects the function to add a new stock event to the store.
 * @param store The stock store from which to select.
 * @returns The function to add a new stock event.
 */
export const selectAdd = (store: StockStoreType) => store.add;
/**
 * Selects the function to reset the stock store.
 * @param store The stock store from which to select.
 * @returns The function to reset the stock store.
 */
export const selectReset = (store: StockStoreType) => store.reset;
/**
 * Selects the array of stock event IDs from the store.
 * @param store The stock store from which to select.
 * @returns The array of stock event IDs.
 */
export const selectIds = (store: StockStoreType) => store.ids;
/**
 * Selects the array of average prices from the store.
 * @param store The stock store from which to select.
 * @returns The array of average prices.
 */
export const selectAveragePrices = (store: StockStoreType) =>
  store.averagePrices;
/**
 * Selects a specific stock event by its ID from the store.
 * @param store The stock store from which to select.
 * @param id The ID of the stock event to select.
 * @returns The stock event with the specified ID, or undefined if not found.
 */
export const selectStockEvent = (store: StockStoreType, id: StockEvent["id"]) =>
  store.stockMap[id];
