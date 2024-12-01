'use client';

import { Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
export function RadarCharts({ top5BookedServices }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  const chartData = top5BookedServices.map((service) => ({
    browser: service.name,
    visitors: service.bookingCount,
    fill: `hsl(var(--chart-${top5BookedServices.indexOf(service) + 2}))`,
  }));

  // Chart configuration
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  const chartConfig = top5BookedServices.reduce((config, service, index) => {
    config[service.name.toLowerCase()] = {
      label: service.name,
      color: `hsl(var(--chart-${index + 2}))`,
    };
    return config;
  }, {});
  chartConfig.visitors = {
    label: 'Visitors',
  };

  return (
    <Card className="flex flex-col w-1/2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 5 Booked Services</CardTitle>
        <CardDescription>Total Jobs Desription</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={10}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
