import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import type { Race } from '../types/f1';

interface RaceTabsProps {
  races: Array<Race>;
  selectedRound: string;
  onRoundChange: (round: string) => void;
  children: React.ReactNode;
}

export function RaceTabs({
  races,
  selectedRound,
  onRoundChange,
  children,
}: RaceTabsProps) {
  const tabsListRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = 200;
      const currentScroll = tabsListRef.current.scrollLeft;
      const newScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      tabsListRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Tabs
      defaultValue={selectedRound}
      onValueChange={onRoundChange}
      className="w-full"
    >
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          onClick={() => scrollTabs('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div
          className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          ref={tabsListRef}
        >
          <TabsList className="flex gap-1 min-w-max px-10">
            {races.map((race) => (
              <TabsTrigger
                key={race.round}
                value={race.round}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 hover:bg-accent/50 hover:scale-105"
              >
                Round {race.round}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
          onClick={() => scrollTabs('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </Tabs>
  );
}
