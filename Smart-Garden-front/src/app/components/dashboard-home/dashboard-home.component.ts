import { Component, OnInit, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {Chart} from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateHourTempService } from 'src/app/services/date-hour-temp.service';
import { WeatherApiData } from 'src/app/models/weather_data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  providers: [DatePipe]
})
export class DashboardHomeComponent implements OnInit, AfterViewInit {

  @ViewChild('drawer') drawer!: MatDrawer; // Access drawer using the #drawer template reference
  constructor(
    private snackBar: MatSnackBar,
    private dateService : DateHourTempService,
    private datePipe : DatePipe
  ) { 
  }

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  
  // Current Date info 
  formattedTime : string = '';
  formattedDate : string = '';

  private intervalId: any;

  weatherApiData: WeatherApiData = {
    minTemperature: null,
    maxTemperature: null,
    description: null,
    uvindex: null,
    windspeed: null,
    risk : null
  };

  ngAfterViewInit(): void {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Add background color
            borderColor: 'rgba(75, 192, 192, 1)',      // Add border color
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  ngOnInit(): void {

    this.formattedDate = this.datePipe.transform(new Date(), 'EEE, MMMM dd, yyyy') || '';
    this.formattedTime = this.datePipe.transform(new Date(), 'HH:mm') || '';

    const time_param = this.formattedTime.substring(0,2)+":00:00";

    this.intervalId = setInterval(() => {
      this.formattedTime = this.datePipe.transform(new Date(), 'HH:mm') || '';
    }, 1000); // Update every 1 second

    this.dateService.getWeatherData(time_param).subscribe(response => {   
      this.weatherApiData = response;
      if (response.risk === 'H') {
        this.snackBar.open(
          'DANGER : a severe risk of convective storms (thunderstorms/hail/tornadoes) predicted soon !',
          'Close',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['custom-red-style'],
          }
        );
      }
      else if (response.risk === 'M'){
        this.snackBar.open(
          'Warning : a moderate risk of convective storms (thunderstorms/hail/tornadoes) predicted !',
          'Close',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['custom-orange-style'],
          }
        );
      }
    });
    
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  tasks = [
    { title: 'Watering', description: 'Water plants with 1 inch of water in the morning', time: '07:00 AM - 07:30 AM', completed: false },
    { title: 'Fertilizing', description: 'Apply organic fertilizer at base of plants. Quantity: 50g per plant', time: '07:30 AM - 10:00 AM', completed: false },
    { title: 'Pest Inspection', description: 'Check leaves for any signs of aphids or other pests', time: '08:00 AM - 08:30 AM', completed: false }
  ];

  toggleTask(task :any) {
    task.completed = !task.completed;
    this.snackBar.open(
      'Great Job. You have finished a task.',
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['custom-style'],
      }
    );
  }
  
  public doughnutChartLabels: string[] = [];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [7, 3], // Actual value and remaining to max
      backgroundColor: ['#FF6384', '#E0E0E0'], // Color for each section
      borderWidth: 0,
    }
    ];

}
