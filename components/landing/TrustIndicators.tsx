'use client';

import React from 'react';

const brands = ["Global Aid", "Med Corp", "Clean Water", "Rebuild"];

export function TrustIndicators() {
    return (
        <section className="py-12 border-t border-b bg-muted/30">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-widest">Trusted by Global Organizations</p>
                <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale">
                    {brands.map((brand) => (
                        <div key={brand} className="text-xl md:text-2xl font-bold items-center flex gap-2">
                            <div className="h-6 w-6 bg-current rounded-full" />
                            {brand}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
