"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import Graph, { type GraphProps } from "@/src/components/BarGraph/Graph";
import TableData from "@/src/components/Table/ModelTable";
import { AppSidebar } from "@/src/components/Sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import axios from "axios";
import Loading from "@/src/components/Loading";

interface ModelRecommendation {
  date: string | null;
  model_33139: string | null;
}

interface WalletBalanceItem {
  date: string;
  btc: number;
  modelo: number;
}

function ChartContent() {
  const [btcXValues, setBtcXValues] = useState<string[]>([]);
  const [btcYValues, setBtcYValues] = useState<number[]>([]);
  const [modelXValues, setModelXValues] = useState<string[]>([]);
  const [modelYValues, setModelYValues] = useState<number[]>([]);

  const fetchChartData = useCallback(async () => {
    try {
      const response = await fetch("/api/pandora/v1/walletBalance");
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      const dataXValues = data.data.map((item: WalletBalanceItem) =>
        new Date(item.date).toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "2-digit",
        }),
      );

      let btcDataXValues = dataXValues;
      let btcDataYValues = data.data.map((item: WalletBalanceItem) => item.btc);
      // Remove the last value if it is 0
      if (btcDataYValues.at(-1) === 0) {
        btcDataYValues = btcDataYValues.slice(0, -1);
        btcDataXValues = btcDataXValues.slice(0, -1);
      }
      setBtcXValues(btcDataXValues);
      setBtcYValues(btcDataYValues);

      let modelDataXValues = dataXValues;
      let modelDtaYValues = data.data.map((item: WalletBalanceItem) => item.modelo);
      // Remove the last value if it is 0
      if (modelDtaYValues.at(-1) === 0) {
        modelDtaYValues = modelDtaYValues.slice(0, -1);
        modelDataXValues = modelDataXValues.slice(0, -1);
      }
      setModelXValues(modelDataXValues);
      setModelYValues(modelDtaYValues);
    } catch (error) {
      console.error("Error while fetching chart data:", error);
      throw error; // Re-throw to trigger Suspense fallback
    }
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // Show error if no data
  if (
    !btcXValues.length ||
    !btcYValues.length ||
    !modelXValues.length ||
    !modelYValues.length
  ) {
    return <div>Erro ao carregar os dados.</div>;
  }

  const BtcGraphConfig: GraphProps = {
    chartTitle: "Bitcoin monthly changes (%)",
    xValues: btcXValues,
    yValues: btcYValues,
    showLine: false,
    showDataValues: true,
    arrowOption: false,
    isAbsolute: true,
    watermark: "Archie Marques",
    watermarkLocation: "52%",
    watermarkFont: "2rem Inter",
    chartBgColor: "#18181B",
    className: "rounded-md bg-card-color h-full px-4 border",
  };

  const modelGraphConfig: GraphProps = {
    chartTitle: "CatBoost Model monthly performance (%)",
    xValues: modelXValues,
    yValues: modelYValues,
    showLine: false,
    showDataValues: true,
    arrowOption: false,
    isAbsolute: true,
    watermark: "Archie Marques",
    watermarkLocation: "52%",
    watermarkFont: "2rem Inter",
    chartBgColor: "#18181B",
    className: "rounded-md bg-card-color h-full px-4 border",
  };

  return (
    <div className="grid grid-cols-1 my-6 gap-6">
      <div className="h-110">
        <Graph {...modelGraphConfig} />
      </div>
      <div className="h-110">
        <Graph {...BtcGraphConfig} />
      </div>
    </div>
  );
}

function TableContent() {
  const [tableData, setTableData] = useState<ModelRecommendation[]>([]);

  const fetchTableData = useCallback(async () => {
    try {
      const response = await axios.get("/api/pandora/v1/tableData");

      if (response.status !== 200 || !response.data) {
        console.error("Failed to fetch table data:", response.statusText);
        throw new Error("Failed to fetch table data");
      }

      setTableData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching table data:", error);
      throw error; // Re-throw to trigger Suspense fallback
    }
  }, []);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  if (tableData.length === 0) {
    return <div>No table data available</div>;
  }

  return (
    <div className="h-226">
      <TableData />
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <SidebarProvider open={true} defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="w-0">
          <div className="grid grid-cols-[2fr_1fr] h-220 gap-6 mx-6">
            <Suspense fallback={<Loading />}>
              <ChartContent />
            </Suspense>
            <div className="flex flex-col content-between my-6">
              <Suspense fallback={<div>Loading table data...</div>}>
                <TableContent />
              </Suspense>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
