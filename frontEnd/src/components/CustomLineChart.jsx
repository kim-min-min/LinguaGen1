"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart as RechartsLineChart, YAxis, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.jsx";

export const description = "A line chart with a custom label";

// 차트의 기본 설정
const chartConfig = {
  rank: {
    label: "Rank",
    color: "hsl(var(--chart-2))",
  },
  "6월": {
    label: "6월",
    color: "hsl(var(--chart-3))",
  },
  "7월": {
    label: "7월",
    color: "hsl(var(--chart-4))",
  },
  "8월": {
    label: "8월",
    color: "hsl(var(--chart-5))",
  },
  "9월": {
    label: "9월",
    color: "hsl(var(--chart-1))",
  },
  "10월": {
    label: "10월",
    color: "hsl(var(--chart-2))",
  },
  "11월": {
    label: "11월",
    color: "hsl(var(--chart-3))",
  },
};

export function CustomLineChart() {
  const [chartData, setChartData] = useState([]);
  const [rankChange, setRankChange] = useState(null); // 랭킹 변화 정보 저장

  useEffect(() => {
    const fetchRankingData = async () => {
      const user = sessionStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);

        // 오늘 날짜 기준으로 최근 5개월에 해당하는 월 계산
        const today = new Date();
        const monthsToInclude = [];
        for (let i = 5; i >= 0; i--) {
          const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
          monthsToInclude.push(monthDate.getMonth() + 1); // 월 번호 저장 (1월 = 1, 2월 = 2, ...)
        }

        try {
          // 사용자별 월별 랭킹 정보 가져오기
          const response = await axios.get(`http://localhost:8085/api/ranking/${userData.id}`, {
            withCredentials: true,
          });

          // 오늘 날짜 기준으로 최근 5개월의 데이터만 가공
          const formattedData = response.data
              .filter((item) => {
                const month = new Date(item.logDate).getMonth() + 1;
                return monthsToInclude.includes(month); // 최근 5개월 데이터 필터링
              })
              .map((item) => {
                const monthNum = new Date(item.logDate).getMonth() + 1;
                const monthLabel = `${monthNum}월`; // '6월' 형식으로 월 표시
                return {
                  month: monthLabel,
                  rank: item.overallRank,
                  fill: `var(--color-${monthLabel})`,
                };
              });
          setChartData(formattedData);

          // 가장 최근 달과 이전 달 랭킹 비교
          const recentRank = formattedData.at(-1)?.rank; // 마지막(최근) 데이터
          const previousRank = formattedData.at(-2)?.rank; // 마지막에서 두 번째(전월) 데이터
          if (recentRank != null && previousRank != null) {
            const rankDiff = recentRank - previousRank;
            setRankChange(rankDiff);
          }
        } catch (error) {
          console.error("Failed to fetch ranking data:", error);
        }
      }
    };

    fetchRankingData();
  }, []);

  return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>월별 랭킹 차트</CardTitle>
          <CardDescription>June - November 2024</CardDescription>
        </CardHeader>
        <CardContent className="max-lg:flex max-lg:justify-center max-lg:items-center">
          <ChartContainer config={chartConfig} style={{ marginTop: "45px", marginBottom: "95px", height: "150px" }}>
            <RechartsLineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 24,
                  left: 24,
                  right: 24,
                }}
            >
              <CartesianGrid vertical={false} />
              <YAxis hide={true} domain={[1, 10]} reversed={true} />
              <XAxis hide={true} dataKey="month" />
              <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                        indicator="line"
                        nameKey="rank"
                        hideLabel
                    />
                  }
              />
              <Line
                  dataKey="rank"
                  type="monotone"
                  stroke="var(--color-rank)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-rank)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
              >
                <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                    dataKey="month"
                    formatter={(value) => chartConfig[value]?.label}
                />
              </Line>
            </RechartsLineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm max-lg:flex max-lg:justify-center max-lg:items-center">
          <div className="flex gap-2 font-medium leading-none mb-4" style={{ fontSize: "16px", fontWeight: "bold" }}>
            {rankChange != null && (
                rankChange < 0 ? (
                    <span>전월 대비 {Math.abs(rankChange)}등 상승하였습니다! <TrendingUp className="h-4 w-4" /></span>
                ) : rankChange > 0 ? (
                    <span>전월 대비 {Math.abs(rankChange)}등 하락하였습니다. <TrendingDown className="h-4 w-4" /></span>
                ) : (
                    <span>전월 대비 변화가 없습니다.</span>
                )
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            {chartData.length > 0 && `2024년도 ${chartData[0].month}부터 ${chartData.at(-1).month}까지의 랭킹을 나타내고 있습니다.`}
          </div>
        </CardFooter>
      </Card>
  );
}

export default CustomLineChart;
