
import React from 'react';
import { DailyMenu, Dish, Menu } from '@/types';
import { useDailyMenu } from '@/hooks/use-daily-menu';
import DailyCalendar from './DailyCalendar';
import MenuSelector from './MenuSelector';
import CoursesForm from './CoursesForm';

interface DailyPlannerProps {
  menus: Menu[];
  dishes: Dish[];
  dailyMenus: DailyMenu[];
  onSaveDailyMenu: (dailyMenu: DailyMenu) => void;
}

const DailyPlanner: React.FC<DailyPlannerProps> = ({
  menus,
  dishes,
  dailyMenus,
  onSaveDailyMenu,
}) => {
  const {
    selectedMenuId,
    setSelectedMenuId,
    date,
    selectedFirstCourse,
    setSelectedFirstCourse,
    selectedSecondCourse,
    setSelectedSecondCourse,
    selectedDessert,
    setSelectedDessert,
    currentMenuId,
    datesWithMenus,
    handleDateChange,
    handleSave,
  } = useDailyMenu({
    menus,
    dishes,
    dailyMenus,
    onSaveDailyMenu,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Menu selection and calendar */}
        <div className="md:col-span-1 space-y-6">
          <MenuSelector
            menus={menus}
            selectedMenuId={selectedMenuId}
            onMenuSelect={setSelectedMenuId}
          />
          
          <DailyCalendar
            date={date}
            onDateChange={handleDateChange}
            datesWithMenus={datesWithMenus}
          />
        </div>

        {/* Right column - Daily menu details */}
        <div className="md:col-span-2">
          <CoursesForm
            date={date}
            selectedMenuId={selectedMenuId}
            selectedFirstCourse={selectedFirstCourse}
            selectedSecondCourse={selectedSecondCourse}
            selectedDessert={selectedDessert}
            currentMenuId={currentMenuId}
            dishes={dishes}
            menus={menus}
            onFirstCourseSelect={setSelectedFirstCourse}
            onSecondCourseSelect={setSelectedSecondCourse}
            onDessertSelect={setSelectedDessert}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyPlanner;
