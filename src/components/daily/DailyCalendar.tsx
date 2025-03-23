
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface DailyCalendarProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  datesWithMenus: Map<string, boolean>;
}

const DailyCalendar: React.FC<DailyCalendarProps> = ({
  date,
  onDateChange,
  datesWithMenus,
}) => {
  const { t } = useLanguage();
  
  // Custom rendering function for the calendar days
  const renderCalendarDay = (day: Date, modifiers: any) => {
    // Format the date to YYYY-MM-DD for comparison
    const dateStr = format(day, 'yyyy-MM-dd');
    // Check if this date has a menu
    const hasMenu = datesWithMenus.has(dateStr);
    
    // Check if this is the currently selected day (format both for comparison)
    const isSelectedDay = date && format(day, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    
    return (
      <div
        className={cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          hasMenu && !modifiers.selected && "bg-violet-100 text-violet-900 hover:bg-violet-200",
          modifiers.selected && "bg-primary text-primary-foreground",
          isSelectedDay && !modifiers.selected && "bg-blue-500 text-white", // Style for selected day
          modifiers.today && !modifiers.selected && !isSelectedDay && "bg-accent text-accent-foreground",
          "flex items-center justify-center rounded-md"
        )}
      >
        {format(day, 'd')}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t({ en: 'Calendar', es: 'Calendario', ca: 'Calendari' })}
        </CardTitle>
        <CardDescription>
          {t({ 
            en: 'Days with menus are highlighted', 
            es: 'Los días con menús están resaltados', 
            ca: 'Els dies amb menús estan ressaltats' 
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          className="rounded-md border"
          components={{
            Day: ({ date: dayDate, ...props }) => renderCalendarDay(dayDate, props)
          }}
        />
      </CardContent>
    </Card>
  );
};

export default DailyCalendar;
