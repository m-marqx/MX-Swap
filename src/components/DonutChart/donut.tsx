import axios from "axios";
import * as echarts from "echarts";
import React, { useRef, useEffect } from "react";

type EChartsOption = echarts.EChartsOption;

interface DonutChartProps {
    address?: string;
    className?: string;
    theme?: string | object;
    title?: string;
}

const donutPromiseCache = new Map<string, Promise<unknown>>()
const donutDataCache = new Map<string, unknown>()

function donutSuspenseWrapper<T>(key: string, promiseFn: () => Promise<T>): T {
    if (donutDataCache.has(key)) {
        return donutDataCache.get(key) as T
    }

    if (donutPromiseCache.has(key)) {
        throw donutPromiseCache.get(key)
    }

    const promise = promiseFn()
        .then(data => {
            donutDataCache.set(key, data)
            donutPromiseCache.delete(key)
            return data
        })
        .catch(error => {
            donutPromiseCache.delete(key)
            throw error
        })

    donutPromiseCache.set(key, promise)
    throw promise
}

export default function DonutChart({
    address = "",
    className = "w-full h-88",
    theme = "dark",
    title = "Portfolio Balances",
}: DonutChartProps) {
    if (!address) {
        return <div className={`text-center flex flex-col justify-center text-gray-500 ${className}`}>Please connect your wallet</div>
    }

    const chartRef = useRef<HTMLDivElement>(null);
    const data = donutSuspenseWrapper(
        `donut-${address}`,
        async () => {
            const res = await axios.get(`/api/pandora/v1/portfolio?address=${address}`);
            return res.data.result || [];
        }
    );

    // Define stable coins based on the provided data, all Stablcoins contains "USD" in their symbol,  the only exception is DAI which is a stable coin but does not contain "USD" in its symbol.
    const stableCoinsSymbols = data
        .filter((asset) => asset.symbol.includes("USD") || asset.symbol === "DAI")
        .map((asset) => asset.symbol);

    const stableCoinValue = data
        .filter((asset) => stableCoinsSymbols.includes(asset.symbol))
        .reduce((acc, asset) => acc + asset.usd_value, 0);

    const nonStableCoinValue = data
        .filter((asset) => !stableCoinsSymbols.includes(asset.symbol))
        .reduce((acc, asset) => acc + asset.usd_value, 0);

    const chartData = [
        { value: stableCoinValue, name: "Stable", itemStyle: { color: "#d4d4d8" } },
        { value: nonStableCoinValue, name: "Tokens", itemStyle: { color: "#d87a16" } },
    ];

    useEffect(() => {
        let myChart: echarts.ECharts | null = null;
        if (chartRef.current) {
            myChart = echarts.init(chartRef.current, theme);

            const option: EChartsOption = {
                backgroundColor: "transparent",
                tooltip: {
                    trigger: "item",
                    formatter: "{b}: {d}%", // Tooltip showing name, value, and percentage
                },
                legend: {
                    top: "2%",
                    left: "center",
                    orient: "horizontal",
                    textStyle: {
                        color: "#fff", // Legend text color
                        fontSize: "1rem",
                    },
                },
                series: [
                    {
                        name: title,
                        type: "pie",
                        radius: ["55%", "70%"], // Donut shape
                        avoidLabelOverlap: false,
                        padAngle: 4,
                        itemStyle: {
                            borderRadius: "5%",
                        },
                        label: {
                            show: false, // Typically, labels for all slices are not shown directly on a donut
                            formatter: "{b}\n({d}%)", // Show name and percentage
                            fontSize: 14,
                            position: "center",
                        },
                        emphasis: {
                            label: {
                                show: true, // Show label in center on hover
                                fontSize: 24,
                                fontWeight: "bold",
                                formatter: "{b}\n({d}%)", // Show name and percentage in the center on hover
                            },
                        },
                        // labelLine: { // Not needed if labels are in the center or not shown by default
                        //     show: false,
                        // },
                        data: chartData,
                    },
                ],
            };
            myChart.setOption(option);

            const handleResize = () => myChart?.resize();
            window.addEventListener("resize", handleResize);

            return () => {
                if (myChart) {
                    myChart.dispose();
                }
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [data, theme, title]); // Re-run effect if data, theme, or title changes

    return <div ref={chartRef} className={className}></div>;
}
