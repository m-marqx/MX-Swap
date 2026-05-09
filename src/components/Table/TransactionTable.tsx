"use client";

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon, FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Table, // Keep for the body
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { TransactionHistoryItem } from "@/types/AcoountTypes";
import axios from "axios";

type Erc20Transfer = {
    token_name?: string;
    token_symbol?: string;
    token_logo: string | null;
    token_decimals?: string;
    value_formatted?: string;
    direction?: string;
};

type TokenInfo = {
    token_name: string;
    token_symbol: string;
    token_logo: string | null;
    value_formatted: string;
};

type TxRow = {
    block_timestamp: string;
    transaction_fee: string;
    summary: string;
    from_token?: TokenInfo;
    to_token?: TokenInfo;
};

function getTransferValue(transfers: Erc20Transfer[], tokenName: string) {
    const totalValue = transfers
        .filter((transfer) => transfer.token_name === tokenName)
        .reduce((sum, transfer) => {
            const value = Number.parseFloat(transfer.value_formatted || "0");
            return Number.isFinite(value) ? sum + value : sum;
        }, 0);

    const lastTransfer = transfers[transfers.length - 1];
    const decimals = Number(lastTransfer?.token_decimals);
    const maxPrecision = 12;

    return Number.isFinite(decimals) && decimals <= maxPrecision
        ? totalValue.toString()
        : totalValue.toFixed(maxPrecision);
}

function getTokenInfo(transfers: Erc20Transfer[]): TokenInfo | undefined {
    const lastTransfer = transfers[transfers.length - 1];

    if (!lastTransfer?.token_name || !lastTransfer.token_symbol) {
        return undefined;
    }

    return {
        token_name: lastTransfer.token_name,
        token_symbol: lastTransfer.token_symbol,
        token_logo: lastTransfer.token_logo,
        value_formatted: getTransferValue(transfers, lastTransfer.token_name),
    };
}

function mapTransactions(result: unknown): TxRow[] {
    if (!Array.isArray(result)) {
        return [];
    }

    return result.map((item: TransactionHistoryItem) => {
        const erc20 = Array.isArray(item.erc20_transfers) ? item.erc20_transfers : [];
        const sendTransfers = erc20.filter((transfer) => transfer.direction === "send");
        const receiveTransfers = erc20.filter((transfer) => transfer.direction === "receive");

        return {
            block_timestamp: item.block_timestamp,
            transaction_fee: item.transaction_fee || "0",
            summary: item.summary || "-",
            from_token: getTokenInfo(sendTransfers),
            to_token: getTokenInfo(receiveTransfers),
        };
    });
}

export default function TransactionTable({ address }: { address: string }) {
    const [data, setData] = useState<TxRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([
        { id: "block_timestamp", desc: true },
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [filterInputVisibility, setFilterInputVisibility] = useState<
        Record<string, boolean>
    >({});

    const toggleFilterInput = useCallback(
        (columnId: string, event?: React.MouseEvent) => {
            if (event) event.stopPropagation();
            setFilterInputVisibility((prev) => {
                const isCurrentlyVisible = !!prev[columnId];
                const newVisibility: Record<string, boolean> = {};
                if (!isCurrentlyVisible) {
                    newVisibility[columnId] = true;
                }
                return newVisibility;
            });
        },
        [],
    );

    useEffect(() => {
        if (!address) {
            setData([]);
            setError(null);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        setIsLoading(true);
        setError(null);

        axios
            .get(`/api/pandora/v1/portfolio/account?address=${encodeURIComponent(address)}`, {
                signal: controller.signal,
            })
            .then((res) => {
                setData(mapTransactions(res.data?.result));
            })
            .catch((fetchError) => {
                if (axios.isCancel(fetchError) || fetchError?.code === "ERR_CANCELED") {
                    return;
                }

                console.error("Error fetching transactions:", fetchError);
                setData([]);
                setError("Unable to load transactions.");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, [address]);

    const columns = useMemo<ColumnDef<TxRow>[]>(
        () => [
            {
                header: "Timestamp",
                accessorKey: "block_timestamp",
                cell: ({ row }) => {
                    const ts = row.getValue("block_timestamp");
                    return ts ? new Date(ts as string).toLocaleString() : "-";
                },
            },
            {
                header: "Fee (MATIC)",
                accessorKey: "transaction_fee",
                cell: ({ row }) => Number(row.getValue("transaction_fee")).toFixed(8),
            },
            {
                header: "Summary",
                accessorKey: "summary",
            },
            {
                accessorKey: "from_token",
                header: ({ column }) => (
                    <div className="relative text-center">
                        <div className="flex items-center justify-center">
                            <span>From Token</span>
                            <button
                                onClick={(e) => toggleFilterInput(column.id, e)}
                                className="ml-1 p-0.5 cursor-pointer rounded hover:bg-zinc-600"
                                title="Filter From Token"
                            >
                                <FilterIcon size={14} className="text-white/70" />
                            </button>
                        </div>
                        {filterInputVisibility[column.id] && (
                            <div
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="text"
                                    value={(column.getFilterValue() as string) ?? ""}
                                    onChange={(e) => column.setFilterValue(e.target.value)}
                                    placeholder="Symbol"
                                    className="p-1 text-xs text-center border border-zinc-600 rounded bg-zinc-700 text-white placeholder-zinc-400 w-32 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>
                ),
                cell: ({ row }) => {
                    const token = row.original.from_token;
                    return token ? (
                        <div className="flex items-center gap-2 justify-center">
                            {token.token_logo && (
                                <img
                                    src={token.token_logo}
                                    alt={token.token_symbol}
                                    className="w-6 h-6 rounded-full"
                                />
                            )}
                            <span>
                                {token.value_formatted} {token.token_symbol}
                            </span>
                        </div>
                    ) : (
                        "-"
                    );
                },
                filterFn: (row, columnId, filterValue) => {
                    const searchTerm = String(filterValue).toLowerCase();
                    if (!searchTerm) return true;
                    const token = row.original.from_token;
                    if (!token) return false;
                    return (
                        token.token_symbol.toLowerCase().includes(searchTerm) ||
                        token.token_name.toLowerCase().includes(searchTerm)
                    );
                },
            },
            {
                accessorKey: "to_token",
                header: ({ column }) => (
                    <div className="relative text-center">
                        <div className="flex items-center justify-center">
                            <span>To Token</span>
                            <button
                                onClick={(e) => toggleFilterInput(column.id, e)}
                                className="ml-1 p-0.5 cursor-pointer rounded hover:bg-zinc-600"
                                title="Filter To Token"
                            >
                                <FilterIcon size={14} className="text-white/70" />
                            </button>
                        </div>
                        {filterInputVisibility[column.id] && (
                            <div
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="text"
                                    value={(column.getFilterValue() as string) ?? ""}
                                    onChange={(e) => column.setFilterValue(e.target.value)}
                                    placeholder="Symbol"
                                    className="p-1 text-xs text-center border border-zinc-600 rounded bg-zinc-700 text-white placeholder-zinc-400 w-32 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>
                ),
                cell: ({ row }) => {
                    const token = row.original.to_token;
                    return token ? (
                        <div className="flex items-center gap-2 justify-center">
                            {token.token_logo && (
                                <img
                                    src={token.token_logo}
                                    alt={token.token_symbol}
                                    className="w-6 h-6 rounded-full"
                                />
                            )}
                            <span>
                                {token.value_formatted} {token.token_symbol}
                            </span>
                        </div>
                    ) : (
                        "-"
                    );
                },
                filterFn: (row, columnId, filterValue) => {
                    const searchTerm = String(filterValue).toLowerCase();
                    if (!searchTerm) return true;
                    const token = row.original.to_token;
                    if (!token) return false;
                    return (
                        token.token_symbol.toLowerCase().includes(searchTerm) ||
                        token.token_name.toLowerCase().includes(searchTerm)
                    );
                },
            },
        ],
        [filterInputVisibility, toggleFilterInput],
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        enableSortingRemoval: false,
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="flex flex-col h-201">
            <div className="bg-zinc-900 w-full h-full rounded-md flex-1 min-h-0 flex flex-col">
                {/* Use a raw table element for the header to avoid Table component's overflow wrapper */}
                <table className={cn("table-fixed w-full caption-bottom text-sm")}>
                    <TableHeader className="text-center rounded-md hover:bg-card-color">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-card-color">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="py-2 px-1 hover:bg-zinc-700 rounded-md"
                                            style={{
                                                width:
                                                    header.getSize() !== 0 ? header.getSize() : undefined,
                                            }}
                                        >
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <div
                                                    className={cn(
                                                        "flex h-full cursor-pointer items-center justify-center gap-2 select-none text-white/85",
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            header.column.getCanSort() &&
                                                            (e.key === "Enter" || e.key === " ")
                                                        ) {
                                                            e.preventDefault();
                                                            header.column.getToggleSortingHandler()?.(e);
                                                        }
                                                    }}
                                                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                                                    title={
                                                        header.column.getCanSort()
                                                            ? header.column.getNextSortingOrder() === "asc"
                                                                ? "Sort ascending"
                                                                : header.column.getNextSortingOrder() === "desc"
                                                                    ? "Sort descending"
                                                                    : "Clear sort"
                                                            : undefined
                                                    }
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                    {{
                                                        asc: (
                                                            <ChevronUpIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                        desc: (
                                                            <ChevronDownIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                </table>
                <div
                    ref={containerRef}
                    className="flex-1 min-h-0 overflow-y-auto rounded-md scrollbar-subtle"
                >
                    {/* The body can still use the Table component if desired, as its overflow is for rows */}
                    <Table className="table-fixed w-full scrollbar-subtle">
                        <TableBody>
                            {!address ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                        Please connect your wallet
                                    </TableCell>
                                </TableRow>
                            ) : isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                        Loading transactions...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-red-400">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="text-center"
                                                style={{
                                                    width:
                                                        cell.column.getSize() !== 0
                                                            ? cell.column.getSize()
                                                            : undefined,
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
