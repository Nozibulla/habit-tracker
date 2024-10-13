import { Injectable } from '@angular/core';
import { Habit } from './habit.model';
import { getString, setString } from '@nativescript/core/application-settings';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private habits: Habit[] = [];

  constructor() {
    this.loadHabits();
  }

  private loadHabits(): void {
    const habitsString = getString('habits', '[]');
    this.habits = JSON.parse(habitsString);
  }

  private saveHabits(): void {
    setString('habits', JSON.stringify(this.habits));
  }

  getHabits(): Habit[] {
    return this.habits;
  }

  getHabit(id: string): Habit | undefined {
    return this.habits.find(h => h.id === id);
  }

  addHabit(name: string): void {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      entries: {},
    };
    this.habits.push(newHabit);
    this.saveHabits();
  }

  updateHabitEntry(habitId: string, date: string, status: 'green' | 'yellow' | 'red' | null): void {
    const habit = this.getHabit(habitId);
    if (habit) {
      habit.entries[date] = status;
      this.saveHabits();
    }
  }

  getHabitReport(habitId: string): { total: number, green: number, yellow: number, red: number } {
    const habit = this.getHabit(habitId);
    if (!habit) return { total: 0, green: 0, yellow: 0, red: 0 };

    const report = { total: 0, green: 0, yellow: 0, red: 0 };
    for (const status of Object.values(habit.entries)) {
      report.total++;
      if (status === 'green') report.green++;
      else if (status === 'yellow') report.yellow++;
      else if (status === 'red') report.red++;
    }
    return report;
  }
}