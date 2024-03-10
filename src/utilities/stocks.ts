import { createId } from "@paralleldrive/cuid2";

export const stockList = new Array(100).fill(null).map((_, i) => `STK${i}`);
export const minStockPrice = 200;
export const maxStockPrice = 800;

export type StockEvent = {
  id: string;
  name: string;
  price: number;
};

export const generateRandomStockEvent = (): StockEvent => {
  const id = createId();
  const name = stockList[Math.floor(Math.random() * stockList.length)];
  const price =
    Math.round(
      minStockPrice + Math.random() * (maxStockPrice - minStockPrice) * 100
    ) / 100;

  return { id, name, price };
};
