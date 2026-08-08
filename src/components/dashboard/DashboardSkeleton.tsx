import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-skeleton">
      {/* Welcome Skeleton */}
      <div className="h-36 w-full rounded-2xl bg-muted/60" />

      {/* Filter Row Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-36 rounded-lg bg-muted/60" />
        <div className="h-9 w-32 rounded-xl bg-muted/60" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-muted/60 border border-border/40 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 rounded bg-muted-foreground/20" />
              <div className="h-10 w-10 rounded-xl bg-muted-foreground/20" />
            </div>
            <div className="h-8 w-32 rounded bg-muted-foreground/30" />
            <div className="h-4 w-full rounded bg-muted-foreground/20" />
          </div>
        ))}
      </div>

      {/* Additional Overview Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-2xl bg-muted/60 border border-border/40" />
        <div className="h-72 rounded-2xl bg-muted/60 border border-border/40" />
      </div>
    </div>
  );
};
