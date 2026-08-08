import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Sparkles, LucideIcon } from 'lucide-react';

interface PlaceholderModulePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const PlaceholderModulePage: React.FC<PlaceholderModulePageProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <DashboardLayout pageTitle={title}>
      <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-12 text-center my-8 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <Icon className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Module Ready for Integration</span>
        </div>

        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>
      </div>
    </DashboardLayout>
  );
};
