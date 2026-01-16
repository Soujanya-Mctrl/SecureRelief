'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

const feed = [
    {
        id: 1,
        title: "Medical supplies arrived at Base Camp Alpha",
        desc: "The convoy successfully delivered 500kg of antibiotics and first aid kits. Distribution starts immediately.",
        time: "Just now",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Temporary Shelter Construction Began",
        desc: "Volunteers have started erecting 200 waterproof tents in the northern district.",
        time: "2 hours ago",
        image: "https://images.unsplash.com/photo-1526973947477-85fd47352378?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Food Distribution Center Opened",
        desc: "Hot meals are now being served to over 1,000 displaced residents.",
        time: "Yesterday, 4:00 PM",
        image: null
    }
];

const donors = [
    { name: "John Doe", time: "2 mins ago", amount: "+$250", initial: "JD" },
    { name: "Jane Smith", time: "16 mins ago", amount: "+$50", initial: "JS" },
    { name: "Anonymous", time: "1 hour ago", amount: "+$1,000", initial: "A" },
    { name: "Michael C.", time: "2 hours ago", amount: "+$100", initial: "MC" }
];

export function ActivityFeed() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Live from the Field</CardTitle>
                    <button className="text-sm text-primary hover:underline">View All Updates</button>
                </CardHeader>
                <CardContent className="space-y-8">
                    {feed.map((item, i) => (
                        <div key={item.id} className="flex gap-4 relative">
                            {/* Timeline Line */}
                            {i !== feed.length - 1 && (
                                <div className="absolute top-8 left-2 bottom-[-40px] w-0.5 bg-border" />
                            )}

                            <div className="relative z-10">
                                <div className="h-4 w-4 mt-1 rounded-full border-2 border-primary bg-background" />
                            </div>

                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase text-primary tracking-wider">{item.time}</span>
                                </div>
                                <h4 className="font-semibold">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                                {item.image && (
                                    <img src={item.image} alt="Update" className="rounded-lg h-32 w-full md:w-48 object-cover mt-2" />
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Donors</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {donors.map((donor, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="text-xs bg-primary/10 text-primary">{donor.initial}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{donor.name}</p>
                                        <p className="text-xs text-muted-foreground">{donor.time}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">{donor.amount}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <button className="text-sm text-primary font-medium hover:underline">See all donors</button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
