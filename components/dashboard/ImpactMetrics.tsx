'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Users, Utensils, Home } from 'lucide-react';

const metrics = [
    {
        label: "Families Helped",
        value: "12,450",
        icon: Users,
        color: "bg-blue-100 text-blue-600"
    },
    {
        label: "Meals Served",
        value: "85,000",
        icon: Utensils,
        color: "bg-green-100 text-green-600"
    },
    {
        label: "Tents Deployed",
        value: "3,200",
        icon: Home,
        color: "bg-orange-100 text-orange-600"
    }
];

export function ImpactMetrics() {
    return (
        <div className="space-y-4">
            {metrics.map((metric) => (
                <Card key={metric.label}>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${metric.color}`}>
                            <metric.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                            <h4 className="text-2xl font-bold">{metric.value}</h4>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
