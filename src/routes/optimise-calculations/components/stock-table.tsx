import { forwardRef, memo } from "react";
import { StockEvent } from "../../../utilities/stocks";
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Table,
} from "@nextui-org/react";

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

export type TableProps = {
  list: StockEvent[];
};

export const StockTable = memo(
  forwardRef<HTMLTableElement, TableProps>(({ list }, ref) => {
    return (
      <Table
        ref={ref}
        aria-label="Example table with dynamic content"
        className="w-screen-sm h-96 [&>div]:flex-1"
        isHeaderSticky
      >
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No stocks to display."} items={list}>
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
  })
);
