
export type Language = 'es' | 'ca' | 'en';

export interface MultilingualText {
  es: string;
  ca: string;
  en: string;
}

export interface Dish {
  id: string;
  name: MultilingualText;
  type: 'first' | 'second' | 'dessert';
  createdAt: Date;
  updatedAt: Date;
}

export interface Menu {
  id: string;
  name: MultilingualText;
  description?: MultilingualText;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyMenu {
  id: string;
  date: Date;
  menuId: string;
  firstCourse: string | null; // Dish ID
  secondCourse: string | null; // Dish ID
  dessert: string | null; // Dish ID
  createdAt: Date;
  updatedAt: Date;
}
