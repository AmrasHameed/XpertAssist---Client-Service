'use client';

import { TrendingUp } from 'lucide-react';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

interface RadialChartProps {
  color: string;
  value: number;
  type:
    | 'Earning'
    | 'Jobs Completed'
    | 'Total Jobs'
    | 'Total Distance'
    | 'Users'
    | 'Experts'
    | 'Services';
  growth: number | null;
}

export function RadialChart({ color, value, type, growth }: RadialChartProps) {
  const getMaxValue = (
    type: 'Earning' | 'Jobs Completed' | 'Total Jobs' | 'Total Distance'
  ): number => {
    switch (type) {
      case 'Earning':
        return 10000;
      case 'Jobs Completed':
        return 50;
      case 'Total Jobs':
        return 50;
      case 'Total Distance':
        return 100;
      default:
        return 100;
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  const maxValue = getMaxValue(type);
  const getAngle = (value: number, maxValue: number) => {
    return (value / maxValue) * 360;
  };
  const startAngle = 90;
  const endAngle = startAngle - getAngle(value, maxValue);

  const chartData = [
    { browser: 'Safari', visitors: value, fill: 'var(--color-safari)' },
  ];
  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    safari: {
      label: 'Safari',
      color: `hsl(var(--chart-${color}))`,
    },
  } satisfies ChartConfig;
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={90}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {type === 'Earning' && '₹'}
                          {chartData[0].visitors.toLocaleString()}
                          {type === 'Total Distance' && (
                            <tspan fontSize="0.55em" dy="0.1em">
                              {' '}
                              km
                            </tspan>
                          )}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {type}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-sm">
        <div className="flex items-center font-medium leading-none">
          Trending up by {growth}% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
