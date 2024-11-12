'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PieCharts({ top5Experts }) {
    const chartConfig = {
        expert1: { label: top5Experts[0]?.name, color: 'hsl(var(--chart-1))' },
        expert2: { label: top5Experts[1]?.name, color: 'hsl(var(--chart-2))' },
        expert3: { label: top5Experts[2]?.name, color: 'hsl(var(--chart-3))' },
        expert4: { label: top5Experts[3]?.name, color: 'hsl(var(--chart-4))' },
        expert5: { label: top5Experts[4]?.name, color: 'hsl(var(--chart-5))' },
      };
    
      const desktopData = [
        {
          name: top5Experts[0]?.name,
          desktop: top5Experts[0]?.totalEarning,
          fill: 'hsl(var(--chart-1))',
        },
        {
          name: top5Experts[1]?.name,
          desktop: top5Experts[1]?.totalEarning,
          fill: 'hsl(var(--chart-2))',
        },
        {
          name: top5Experts[2]?.name,
          desktop: top5Experts[2]?.totalEarning,
          fill: 'hsl(var(--chart-3))',
        },
        {
          name: top5Experts[3]?.name,
          desktop: top5Experts[3]?.totalEarning,
          fill: 'hsl(var(--chart-4))',
        },
        {
          name: top5Experts[4]?.name,
          desktop: top5Experts[4]?.totalEarning,
          fill: 'hsl(var(--chart-5))',
        },
      ];
    
      const id = 'pie-interactive';
      const [activename, setActivename] = React.useState(desktopData[0].name);
    
      const activeIndex = React.useMemo(
        () => desktopData.findIndex((item) => item.name === activename),
        [activename]
      );
    
      return (
        <Card data-chart={id} className="flex flex-col w-1/2">
          <ChartStyle id={id} config={chartConfig} />
          <CardHeader className="flex-row items-start space-y-0 pb-0">
            <div className="grid gap-1">
              <CardTitle>Top 5 Experts</CardTitle>
              <CardDescription>Total Earnings Description</CardDescription>
            </div>
            <Select value={activename} onValueChange={setActivename}>
              <SelectTrigger
                className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Select name" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                <SelectItem value={top5Experts[0]?.name} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: chartConfig.expert1.color }} />
                    {chartConfig.expert1.label}
                  </div>
                </SelectItem>
                <SelectItem value={top5Experts[1]?.name} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: chartConfig.expert2.color }} />
                    {chartConfig.expert2.label}
                  </div>
                </SelectItem>
                <SelectItem value={top5Experts[2]?.name} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: chartConfig.expert3.color }} />
                    {chartConfig.expert3.label}
                  </div>
                </SelectItem>
                <SelectItem value={top5Experts[3]?.name} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: chartConfig.expert4.color }} />
                    {chartConfig.expert4.label}
                  </div>
                </SelectItem>
                <SelectItem value={top5Experts[4]?.name} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: chartConfig.expert5.color }} />
                    {chartConfig.expert5.label}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex flex-1 justify-center pb-0">
            <ChartContainer
              id={id}
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={desktopData}
                  dataKey="desktop"
                  nameKey="name"
                  innerRadius={70}
                  strokeWidth={5}
                  activeIndex={activeIndex}
                  activeShape={({ outerRadius = 0, ...props }) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}
                >
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
                              ₹
                              {desktopData[activeIndex].desktop.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Earning
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      );
}
