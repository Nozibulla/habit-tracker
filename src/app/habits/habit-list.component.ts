import { Component, OnInit } from '@angular/core';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';

@Component({
  selector: 'ns-habit-list',
  templateUrl: './habit-list.component.html',
})
export class HabitListComponent implements OnInit {
  habits: Habit[] = [];
  newHabitName = '';

  constructor(private habitService: HabitService) {}

  ngOnInit(): void {
    this.habits = this.habitService.getHabits();
  }

  addHabit(): void {
    if (this.newHabitName.trim()) {
      this.habitService.addHabit(this.newHabitName.trim());
      this.newHabitName = '';
      this.habits = this.habitService.getHabits();
    }
  }
}