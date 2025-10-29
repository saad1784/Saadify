import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
);

function fmt(n) {
  const v = Math.abs(n ?? 0);
  if (v >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (v >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (v >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n ?? 0);
}


const SalesChart = ({
  salesData = [],
  title = "Sales & Orders Chart",
  height = 440,
}) => {
  const candles = useMemo(() => {
    if (!salesData.length) return [];
    let prevClose = Number(salesData[0]?.sales ?? 0);
    return salesData.map((d, i) => {
      const close = Number(d.sales ?? 0);
      const open = i === 0 ? close : prevClose;
      // make bodies visually prominent; spread grows with move size + orders
      const delta = Math.abs(close - open);
      const spread = Math.max(1, delta * 0.5 + (Number(d.numOrders ?? 0) * 0.25));
      const high = Math.max(open, close) + spread;
      const low = Math.min(open, close) - spread;
      prevClose = close;

      // invert colors per your rule (we’ll apply via dataset script)
      const upVsPrev = close >= (i > 0 ? Number(salesData[i - 1].sales ?? 0) : close);
      return { x: new Date(d.date), o: open, h: high, l: low, c: close, upVsPrev };
    });
  }, [salesData]);

  // Orders as right-axis line
  const orders = useMemo(
    () => salesData.map((d) => ({ x: new Date(d.date), y: Number(d.numOrders ?? 0) })),
    [salesData]
  );

  // Axis zoom so candles fill the space
  const { yMin, yMax } = useMemo(() => {
    if (!candles.length) return { yMin: 0, yMax: 1 };
    const lows = candles.map((d) => d.l);
    const highs = candles.map((d) => d.h);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const pad = (max - min || 1) * 0.08; // 8% breathing room
    return { yMin: min - pad, yMax: max + pad };
  }, [candles]);

  const data = useMemo(
    () => ({
      datasets: [
        {
          type: "candlestick",
          label: "Sales (OHLC)",
          data: candles,
          yAxisID: "y",

          // Keep these as strings (fixes hover toString crash)
          borderColor: "#111827",
          hoverBorderColor: "#111827",

          // We'll provide per-item colors with scriptable opts below:
          //   - RED if today >= yesterday
          //   - GREEN if today <  yesterday
          upColor: "#16a34a",          // default green body
          downColor: "#ef4444",        // default red body
          borderUpColor: "#16a34a",
          borderDownColor: "#ef4444",
          wickUpColor: "#16a34a",
          wickDownColor: "#ef4444",

          // Wider bodies (looks like trading apps)
          barThickness: 18,

          // Scriptables to override per-candle color using upVsPrev flag
          // (Chart.js passes context.raw which is our candle object)
          color: (ctx) => (ctx.raw?.upVsPrev ? "#ef4444" : "#16a34a"),
          borderColor: (ctx) => (ctx.raw?.upVsPrev ? "#ef4444" : "#16a34a"),
          wickColor: (ctx) => (ctx.raw?.upVsPrev ? "#ef4444" : "#16a34a"),
        },
        {
          type: "line",
          label: "Orders",
          data: orders,
          yAxisID: "y1",
          borderColor: "rgb(220,52,69)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.25,
        },
      ],
    }),
    [candles, orders]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      layout: { padding: 8 },
      plugins: {
        legend: { position: "top", labels: { color: "#111827", boxWidth: 14, padding: 12 } },
        title: { display: true, text: title, color: "#111827", font: { size: 18 } },
        tooltip: {
          backgroundColor: "rgba(17,24,39,0.92)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "rgba(0,0,0,0.2)",
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              if (ctx.dataset.type === "candlestick") {
                const v = ctx.raw;
                return ` O:${fmt(v.o)}  H:${fmt(v.h)}  L:${fmt(v.l)}  C:${fmt(v.c)}`;
              }
              return ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: { unit: "day" },
          grid: { display: false },          // ← remove grey verticals
          ticks: { color: "#111827", maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
        },
        y: {
          position: "left",
          grid: { display: false },          // ← remove grey horizontals
          ticks: { color: "#065f46", callback: (v) => fmt(v) },
          min: yMin,
          max: yMax,
          title: { display: true, text: "Sales", color: "#065f46" },
        },
        y1: {
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: { color: "rgb(220,52,69)", precision: 0 },
          beginAtZero: true,
        },
      },
    }),
    [title, yMin, yMax]
  );

  if (!salesData.length) {
    return (
      <div
        style={{
          width: "100%",
          height,
          display: "grid",
          placeItems: "center",
          borderRadius: 12,
          background: "#fff",
          color: "#6b7280",
          border: "1px dashed #e5e7eb",
        }}
      >
        No data to display
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height,
        margin: "20px auto",
        background: "#fff",
        padding: 12,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart;