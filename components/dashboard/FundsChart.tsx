'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Week 1', amount: 50 },
    { name: 'Week 2', amount: 120 },
    { name: 'Week 3', amount: 350 },
    { name: 'Week 4', amount: 980 },
    { name: 'Week 5', amount: 1600 },
    { name: 'Week 6', amount: 2400 },
    { name: 'Week 7', amount: 3100 },
];

export function FundsChart() {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Funds Deployed</CardTitle>
                <p className="text-sm text-muted-foreground">Cumulative spending over time</p>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number | undefined) => [`$${value}k`, 'Funds']}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#0052FF"
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
