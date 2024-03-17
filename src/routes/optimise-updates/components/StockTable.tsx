import { useStockStore } from "../store/stock-store";
import { selectIds } from "../store/stock-store-selectors";

export const StockTable = () => {
  const ids = useStockStore(selectIds);
  return <div>{ids}</div>;
};
