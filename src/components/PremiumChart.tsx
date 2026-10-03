import React, { useEffect, useRef } from 'react';
import { CarrierDetail, PremiumAnalysis } from '../types/insurance';

declare global {
  interface Window {
    Chart?: any;
  }
}

interface PremiumChartProps {
  carriers: CarrierDetail[];
  premiumAnalysis: PremiumAnalysis;
  cheapestCarrierName?: string;
}

export const PremiumChart: React.FC<PremiumChartProps> = ({
  carriers,
  premiumAnalysis,
  cheapestCarrierName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !window.Chart) return;

    // Destroy existing chart if present
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = carriers.map((c) => c.carrier_name);
    const data = carriers.map((c) => c.annual_premium || 0);
    const average = premiumAnalysis.average_premium || 0;

    const backgroundColors = carriers.map((c) => {
      if (c.carrier_name === cheapestCarrierName) {
        return '#10b981'; // Emerald Green
      }
      return '#3b82f6'; // Bright Blue
    });

    const borderColors = carriers.map((c) => {
      if (c.carrier_name === cheapestCarrierName) {
        return '#059669';
      }
      return '#1d4ed8';
    });

    chartInstanceRef.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Estimated Annual Premium ($)',
            data: data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1.5,
            borderRadius: 6,
            barThickness: 32,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#94a3b8',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (context: any) => {
                const val = context.raw || 0;
                const diff = average ? (((val - average) / average) * 100).toFixed(1) : '0';
                return ` Premium: $${val.toLocaleString()} (${Number(diff) > 0 ? `+${diff}%` : `${diff}%`} vs avg)`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#94a3b8',
              font: {
                size: 11,
                family: 'Inter',
              },
            },
          },
          y: {
            grid: {
              color: '#334155',
              lineWidth: 0.5,
            },
            ticks: {
              color: '#94a3b8',
              callback: (value: any) => `$${value.toLocaleString()}`,
              font: {
                size: 10,
                family: 'Inter',
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [carriers, premiumAnalysis, cheapestCarrierName]);

  return (
    <div className="w-full h-64 sm:h-72">
      <canvas ref={canvasRef} />
    </div>
  );
};
