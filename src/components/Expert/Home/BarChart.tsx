'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function BarChartMonthly({ dailyEarnings }) {
  const chartData =
    Array.isArray(dailyEarnings) && dailyEarnings.length
      ? dailyEarnings.map((item) => ({
          date: `${new Date().getFullYear()}-${new Date().getMonth()}-${item.date.padStart(
            2,
            '0'
          )}`,
          earning: item.dailyEarnings,
        }))
      : [
          { date: '2024-04-01', earning: 0 },
          { date: '2024-04-02', earning: 0 },
        ];

  const chartConfig = {
    views: {
      label: 'Earnings',
    },
    earnings: {
      label: 'Earnings',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('earnings');

  const total = React.useMemo(
    () => ({
      earnings: dailyEarnings?.reduce(
        (acc, curr) => acc + curr.dailyEarnings,
        0
      ),
    }),
    [dailyEarnings]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Earnings Per Day - Current Month</CardTitle>
          <CardDescription>
            Showing total earnings for the current month
          </CardDescription>
        </div>
        <div className="flex">
          {['earnings'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  ₹{' '}
                  {(
                    total[key as keyof typeof total]?.toFixed(2) || '0.00'
                  ).toLocaleString('en-IN')}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey="earning" fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
