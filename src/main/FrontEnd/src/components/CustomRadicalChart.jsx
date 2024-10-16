"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart" // ChartConfig 제거

export const description = "A radial chart with a custom shape"

const chartData = [
  { browser: "safari", visitors: 120, fill: "var(--color-safari)" },
]

const chartConfig = {
  visitors: {
    label: "Achivemenets",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
}

export function CustomRadialChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-6">
        <CardTitle>달성 업적 수</CardTitle>
        <CardDescription>2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Achievements
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm" style={{height : '95px'}}>
        <div className="flex items-center gap-2 font-medium leading-none mb-4" style={{fontSize : '16px', fontWeight : 'bold'}}>
          업적 120개를 달성 하였습니다! <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          달성한 업적의 수를 나타내고 있습니다
        </div>
      </CardFooter>
    </Card>
  )
}

export default CustomRadialChart;
