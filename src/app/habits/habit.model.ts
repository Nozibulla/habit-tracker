export interface Habit {
  id: string;
  name: string;
  entries: {
    [date: string]: 'green' | 'yellow' | 'red' | null;
  };
}