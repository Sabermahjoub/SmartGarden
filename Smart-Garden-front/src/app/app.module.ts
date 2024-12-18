import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgChartsModule } from 'ng2-charts'; 
import { NgxGaugeModule } from 'ngx-gauge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatBadgeModule} from '@angular/material/badge';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogsComponent } from './components/logs/logs.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreatePlantComponent } from './components/create-plant/create-plant.component';
import { MatSliderModule } from '@angular/material/slider';
import { PredictionComponent } from './components/prediction/prediction.component';
import { ConfirmDialogueComponent } from './components/confirm-dialogue/confirm-dialogue.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardHomeComponent,
    DashboardComponent,
    LogsComponent,
    CreateTaskComponent,
    CreatePlantComponent,
    PredictionComponent,
    ConfirmDialogueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatCardModule,
    MatProgressBarModule,
    NgChartsModule,
    NgxGaugeModule,
    MatSnackBarModule,
    MatBadgeModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatSliderModule,
    MatTableModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
