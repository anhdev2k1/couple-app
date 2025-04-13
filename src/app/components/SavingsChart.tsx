/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SavingCategory } from "../types/saving";
import Image from "next/image";

interface SavingsChartProps {
  monthlyData: { month: string; amount: number }[];
  categoryData: { category: SavingCategory; amount: number }[];
}

export default function SavingsChart({
  monthlyData,
  categoryData,
}: SavingsChartProps) {
  const totalValue = categoryData.reduce(
    (total, item) => total + item.amount,
    0
  );
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="h-64">
        <h3 className="text-center font-medium mb-2">Tiết kiệm theo tháng</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                `${Number(value).toLocaleString()} VND`,
                "Tiết kiệm",
              ]}
              labelFormatter={(label) => `Tháng ${label}`}
            />
            <Bar dataKey="amount" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64">
        <h3 className="text-center font-medium mb-2">Phân bổ theo danh mục</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData.map((item) => ({
                name: item.category.name,
                value: item.amount,
                color: item.category.color,
                imageUrl: item.category.imageUrl,
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.category.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `${Number(value).toLocaleString()} VND`,
                "Tiết kiệm",
              ]}
              content={({ payload }) => {
                const data = payload?.[0]?.payload;
                if (!data) return null;

                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      {data.imageUrl && (
                        <Image
                          src={data.imageUrl}
                          alt={data.name}
                          className="w-8 h-8 object-cover rounded-full mr-2"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm">
                          {data.value.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {((data.value / totalValue) * 100).toFixed(1)}% tổng tiết
                      kiệm
                    </p>
                  </div>
                );
              }}
            />
            <Legend
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center mt-2 gap-2">
                  {payload?.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center text-xs mx-1"
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: entry.color }}
                      />
                      {entry.value}
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
