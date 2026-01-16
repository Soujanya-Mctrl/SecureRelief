'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: 'Medical', value: 45, color: '#3B82F6' }, // Blue
    { name: 'Food', value: 30, color: '#10B981' },    // Green
    { name: 'Shelter', value: 15, color: '#F59E0B' }, // Amber
    { name: 'Logistics', value: 10, color: '#6366F1' },// Indigo
];

export function AllocationChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Allocation</CardTitle>
                <p className="text-sm text-muted-foreground">Where every dollar goes</p>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={data} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={60} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="font-semibold ml-auto">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
