import { NextResponse } from "next/server"
import { TransactionHistoryItem } from "@/types/AcoountTypes"
import axios from "axios"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
        return NextResponse.json({ error: "Missing address" }, { status: 400 })
    }

    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjQyNjgwYjY0LTY2N2EtNDk2Mi1iODYzLWQ0MmExMzhlNjI5OSIsIm9yZ0lkIjoiNDU0OTA4IiwidXNlcklkIjoiNDY4MDM5IiwidHlwZUlkIjoiY2YyNzgxOTUtZGYxMi00MjBlLTk4ZTktMDAxN2UwYTZkNmJhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTAzOTU1MjIsImV4cCI6NDkwNjE1NTUyMn0.U__99fv4owRmaqmhEUtmA77zs4TO9IEJcBJdQoxQ0Zc'
    if (!apiKey) {
        return NextResponse.json({ error: "Missing Moralis API key" }, { status: 500 })
    }

    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/history?chain=polygon&order=DESC`

    try {
        const moralisRes = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": apiKey,
            },
        })

        if (moralisRes.status < 200 || moralisRes.status >= 300) {
            return NextResponse.json({ error: `Failed to fetch from Moralis, ${moralisRes.statusText}` }, { status: moralisRes.status })
        }

        const data = moralisRes.data

        const swaps = Array.isArray(data.result)
            ? data.result.filter((item: TransactionHistoryItem) => item.category === "token swap")
            : []

        return NextResponse.json({ result: swaps })
        } catch (error: unknown) {
        return NextResponse.json({ error: `Error fetching transaction history: ${error}` }, { status: 500 })
    }
}