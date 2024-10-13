import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';

@Component({
  selector: 'ns-habit-report',
  templateUrl: './habit-report.component.html',
})
export class HabitReportComponent implements OnInit {
  habit: Habit;
  report: { total: number; green: number; yellow: number; red: number };

  constructor(
    private route: ActivatedRoute,
    private habitService: HabitService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.habit = this.habitService.getHabit(id);
    this.report = this.habitService.getHabitReport(id);
  }
}