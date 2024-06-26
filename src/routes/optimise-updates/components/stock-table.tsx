import { memo, useCallback, useMemo } from "react";
import { selectIds, selectStockEvent } from "../store/stock-store-selectors";
import { useThrottledStore } from "../hooks/use-throttled-store";
import {
  ComputeItemKey,
  ItemContent,
  TableVirtuoso,
  TableVirtuosoProps,
} from "react-virtuoso";
import { StockEvent } from "../../../utilities/stocks";
import { useStockStore } from "../store/stock-store";

type StockTableRowProps = {
  id: StockEvent["id"];
};

const StockTableRow = ({ id }: StockTableRowProps) => {
  // Read the stock event from the
  const stock = useStockStore((store) => selectStockEvent(store, id));

  if (!stock) {
    return <div className="h-px"></div>;
  }

  return (
    <tr className="w-full flex py-2">
      <td className="flex-1 flex items-center justify-center">{stock.name}</td>
      <td className="flex-1 flex items-center justify-center">{stock.price}</td>
    </tr>
  );
};

const components: TableVirtuosoProps<StockEvent["id"], null>["components"] = {
  EmptyPlaceholder: () => (
    <div className="w-full h-full flex justify-center items-center">
      <p>No data to display</p>
    </div>
  ),
};

/**
 * See {@link "../../reduce-computation/components/stock-table"}
 */
export const StockTable = memo(() => {
  // Consume list of IDs - with throttled updates
  const throttledList = useThrottledStore(selectIds, 1000);
  const throttledReversedList = useMemo(
    () => [...throttledList].reverse(),
    [throttledList]
  );

  const renderItem: ItemContent<StockEvent["id"], null> = useCallback(
    (_, id) => {
      return <StockTableRow id={id} />;
    },
    []
  );

  const keyExtractor: ComputeItemKey<StockEvent["id"], null> = useCallback(
    (_, id) => id,
    []
  );

  const tableHeader = useCallback(() => {
    return (
      <tr className="w-full flex py-2 bg-white drop-shadow-md">
        <th className="flex-1 flex items-center justify-center">Name</th>
        <th className="flex-1 flex items-center justify-center">Price</th>
      </tr>
    );
  }, []);

  return (
    <div className="border-2 rounded">
      <TableVirtuoso
        className="!h-96 [&_table]:w-full [&_table]:h-full"
        data={throttledReversedList}
        itemContent={renderItem}
        computeItemKey={keyExtractor}
        fixedHeaderContent={tableHeader}
        components={components}
        // Remove scroll to bottom
      />
    </div>
  );
});
