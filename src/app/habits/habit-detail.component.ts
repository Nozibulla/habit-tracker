import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';

@Component({
  selector: 'ns-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.css']
})
export class HabitDetailComponent implements OnInit {
  habit: Habit;
  currentDate: Date = new Date();
  calendarDays: Array<{ date: string; isCurrentMonth: boolean; status: string | null; isSelected: boolean }> = [];
  selectedDate: string | null = null;
  calendarRows = 'auto,auto,auto,auto,auto,auto,auto';
  calendarColumns = '*,*,*,*,*,*,*';
  colorCounts = { green: 0, yellow: 0, red: 0 };

  constructor(
    private route: ActivatedRoute,
    private habitService: HabitService,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.habit = this.habitService.getHabit(id);
    this.generateCalendar();
    this.updateColorCounts();
  }

  get currentMonthYear(): string {
    return this.currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];

    // Add days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      this.calendarDays.push(this.createCalendarDay(date, false));
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      this.calendarDays.push(this.createCalendarDay(date, true));
    }

    // Add days from next month
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push(this.createCalendarDay(date, false));
    }

    // Set default selected date to today
    const today = new Date();
    if (today.getMonth() === month && today.getFullYear() === year) {
      this.selectDate(this.calendarDays.find(day => day.date === today.getDate().toString() && day.isCurrentMonth));
    }
  }

  createCalendarDay(date: Date, isCurrentMonth: boolean): { date: string; isCurrentMonth: boolean; status: string | null; isSelected: boolean } {
    return {
      date: date.getDate().toString(),
      isCurrentMonth: isCurrentMonth,
      status: this.getStatusForDate(date),
      isSelected: false
    };
  }

  getStatusForDate(date: Date): string | null {
    const dateString = date.toISOString().split('T')[0];
    return this.habit.entries[dateString] || null;
  }

  selectDate(day: { date: string; isCurrentMonth: boolean; isSelected: boolean }): void {
    if (day && day.isCurrentMonth) {
      this.calendarDays.forEach(d => d.isSelected = false);
      day.isSelected = true;
      const selectedDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        parseInt(day.date)
      );
      this.selectedDate = selectedDate.toISOString().split('T')[0];
    }
  }

  setColor(color: 'green' | 'yellow' | 'red'): void {
    if (this.selectedDate) {
      this.habitService.updateHabitEntry(this.habit.id, this.selectedDate, color);
      this.generateCalendar();
      this.updateColorCounts();
    }
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
    this.updateColorCounts();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
    this.updateColorCounts();
  }

  getRowForIndex(index: number): number {
    return Math.floor(index / 7);
  }

  getColForIndex(index: number): number {
    return index % 7;
  }

  updateColorCounts(): void {
    this.colorCounts = { green: 0, yellow: 0, red: 0 };
    for (const entry of Object.values(this.habit.entries)) {
      if (entry === 'green') this.colorCounts.green++;
      if (entry === 'yellow') this.colorCounts.yellow++;
      if (entry === 'red') this.colorCounts.red++;
    }
  }

  goBack(): void {
    this.routerExtensions.back();
  }
}