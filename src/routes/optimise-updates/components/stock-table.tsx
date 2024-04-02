import { memo, useEffect, useRef } from "react";
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  getKeyValue,
} from "@nextui-org/react";
import { selectIds, selectStockEvent } from "../store/stock-store-selectors";
import { useThrottledStore } from "../hooks/use-throttled-store";

const tableColumns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "price",
    label: "PRICE",
  },
];

export const StockTable = memo(() => {
  const throttledList = useThrottledStore((store) => {
    const ids = selectIds(store);
    return ids.map((id) => selectStockEvent(store, id));
  });

  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (throttledList.length) {
      const scrollContainer = tableRef.current?.parentElement;
      scrollContainer?.scrollTo({
        top: scrollContainer.scrollHeight,
      });
    }
  }, [throttledList.length]);

  return (
    <Table
      ref={tableRef}
      aria-label="Example table with dynamic content"
      className="w-screen-sm h-96 [&>div]:flex-1"
      isHeaderSticky
    >
      <TableHeader columns={tableColumns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent={"No stocks to display."} items={throttledList}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
});
