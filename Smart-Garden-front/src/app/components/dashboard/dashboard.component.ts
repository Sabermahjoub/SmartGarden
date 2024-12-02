import { Component, OnInit, Inject, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DashboardHomeComponent } from '../dashboard-home/dashboard-home.component';
import { LogsComponent } from '../logs/logs.component';
import { Subject, takeUntil } from 'rxjs';
import { PredictionComponent } from '../prediction/prediction.component';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer!: MatDrawer; // Access drawer using the #drawer template reference
  step: string = 'dashboard-home';
  @Output() panelStateChange = new EventEmitter<string>();

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private router : Router) { }

  openHome() : void {
    this.step= 'dashboard-home';
  }

  openPrediction() : void {
    this.step = 'prediction';
  }

  openLogs() : void {
    this.step= 'logs'
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {}

  onParentVariableUpdated(updatedValue: string) {
    this.step = updatedValue;
  }

  logout() : void {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }

}
