import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
        return NextResponse.json({ error: "Missing address" }, { status: 400 })
    }

    const apiKey = process.env.MORALIS_API_KEY
    if (!apiKey) {
        return NextResponse.json({ error: "Missing Moralis API key" }, { status: 500 })
    }

    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=polygon&exclude_spam=true&exclude_unverified_contracts=true`

    try {
        const moralisRes = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": apiKey,
            },
            // cache: "no-store" // optional: always fetch fresh data
        })

        if (moralisRes.status < 200 || moralisRes.status >= 300) {
            return NextResponse.json({ error: `Failed to fetch from Moralis, ${moralisRes.statusText}` }, { status: moralisRes.status })
        }

        const data = moralisRes.data
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}