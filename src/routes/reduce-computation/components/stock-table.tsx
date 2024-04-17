import { memo, useCallback } from "react";
import {
  ComputeItemKey,
  ItemContent,
  TableVirtuoso,
  TableVirtuosoProps,
} from "react-virtuoso";
import { StockEvent } from "../../../utilities/stocks";

type StockTableRowProps = {
  stock: StockEvent;
};

/**
 * Component representing a single row in the stock table.
 * @param props - Props containing stock data.
 */
const StockTableRow = ({ stock }: StockTableRowProps) => {
  return (
    <tr className="w-full flex py-2">
      <td className="flex-1 flex items-center justify-center">{stock.name}</td>
      <td className="flex-1 flex items-center justify-center">{stock.price}</td>
    </tr>
  );
};

const components: TableVirtuosoProps<StockEvent, null>["components"] = {
  EmptyPlaceholder: () => (
    <div className="w-full h-full flex justify-center items-center">
      <p>No data to display</p>
    </div>
  ),
};

export type StockTableProps = {
  list: StockEvent[];
};

/**
 * Component representing a virtualized stock table.
 * @param props - Props containing stock data.
 */
export const StockTable = memo(({ list }: StockTableProps) => {
  /**
   * Callback function to render each stock item in the table.
   * @param index - Index of the item.
   * @param stock - Stock data.
   */
  const renderItem: ItemContent<StockEvent, null> = useCallback((_, stock) => {
    return <StockTableRow stock={stock} />;
  }, []);

  const keyExtractor: ComputeItemKey<StockEvent, null> = useCallback(
    (_, stock) => stock.id,
    []
  );

  /**
   * Function to render the table header.
   */
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
        data={list}
        itemContent={renderItem}
        computeItemKey={keyExtractor}
        fixedHeaderContent={tableHeader}
        followOutput={true}
        components={components}
      />
    </div>
  );
});
