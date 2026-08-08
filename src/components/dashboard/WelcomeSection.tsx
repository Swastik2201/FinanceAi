import React from 'react';
import { Calendar } from 'lucide-react';

interface WelcomeSectionProps {
  userName?: string;
  selectedPeriod?: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName = 'User' }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedMonthYear = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary mb-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{getFormattedMonthYear()}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {getGreeting()}, <span className="text-primary">{userName}</span> 👋
          </h2>

          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Here's your financial overview for {currentMonthName}. Stay on track with your spending and savings goals.
          </p>
        </div>
      </div>
    </div>
  );
};
