import { Component, OnInit, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {Chart} from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateHourTempService } from 'src/app/services/date-hour-temp.service';
import { WeatherApiData, backendData } from 'src/app/models/weather_data';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { CreatePlantComponent } from '../create-plant/create-plant.component';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  providers: [DatePipe]
})
export class DashboardHomeComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer; // Access drawer using the #drawer template reference
  constructor(
    private snackBar: MatSnackBar,
    private dateService : DateHourTempService,
    private datePipe : DatePipe,
    private dialog : MatDialog
  ) { 
  }

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;


  plantNames : string[] = ['Tomato', 'Pea', 'Chickpea', 'Carrot', 'Pepper', 'Potato'];

  
  // Current Date info 
  formattedTime : string = '';
  formattedDate : string = '';

  private intervalId: any;

  backendData : backendData = {
    temperature : null,
    humidity : null,
    light_percentage : null
  }
  weatherApiData: WeatherApiData = {
    sunrise : null,
    sunset : null,
    minTemperature: null,
    maxTemperature: null,
    description: null,
    uvindex: null,
    windspeed: null,
    risk : null
  };

  // ngAfterViewInit(): void {
  //   this.chart = new Chart(this.canvas.nativeElement, {
  //     type: 'bar',
  //     data: {
  //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //       datasets: [
  //         {
  //           label: '# of Votes',
  //           data: [12, 19, 3, 5, 2, 3],
  //           borderWidth: 1,
  //           backgroundColor: 'rgba(75, 192, 192, 0.2)', // Add background color
  //           borderColor: 'rgba(75, 192, 192, 1)',      // Add border color
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //     },
  //   });
  // }

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

    this.dateService.getDataFromBack().subscribe(response => {
      this.backendData = response;
    });
    
  }

  isDay() : boolean {
    if (this.weatherApiData.sunrise === null ) return false;
    return !this.isTimeEarlier(this.weatherApiData.sunrise);
  }

  isNight() : boolean {
    if (this.weatherApiData.sunset === null ) return false;
    return this.isTimeEarlier(this.weatherApiData.sunset);
  }

  isTimeEarlier(time: string): boolean {
    // Split the time strings into hours and minutes
    const [hours1, minutes1] = time.split(":").map(Number);
    const [hours2, minutes2] = this.formattedTime.split(":").map(Number);

    // Compare hours first
    if (hours1 < hours2) {
        return true;
    } else if (hours1 > hours2) {
        return false;
    }

    // If hours are equal, compare minutes
    return minutes1 < minutes2;
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getPercentageOfDoneTasks() : number {
    const percentage = this.getAllDoneTasks() * 100 / this.getTasksLength();
    return Math.trunc(percentage);
  }

  getTasksLength() : number {
    return this.tasks.length;
  }

  getAllDoneTasks(): number {
    return this.tasks.filter(task => task.done).length;
  }

  tasks = [
    { name: 'Watering', description: 'Water plants with 1 inch of water in the morning', starting_time : "23:00", ending_time:"23:30", done: true },
    { name: 'Fertilizing', description: 'Apply organic fertilizer at base of plants. Quantity: 50g per plant', starting_time : "07:00", ending_time:"10:00", done: false },
    { name: 'Pest Inspection', description: 'Check leaves for any signs of aphids or other pests', starting_time : "08:00", ending_time:"08:30", done: false }
  ];

  completeTask(task :any) {
    task.done = !task.done;
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

  openCreatePlantComponent() {
    this.dialog.open(CreatePlantComponent, {
      maxHeight: '90vh', 
      height: '90%',
      minHeight: '450px',
      minWidth: '750px',
      width: '50%',
      panelClass: 'custom-dialog-container',
    });
  };

  openCreateTaskComponent() {
    this.dialog.open(CreateTaskComponent, {
      // data: row,
      height: '90%',
      minHeight: '450px',
      minWidth: '750px',
      width: '50%',
      data: 'create-task',
      panelClass: 'custom-dialog-container',
      // minHeight: '180px',
    });
  };
  
  public doughnutChartLabels: string[] = [];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [7, 3], // Actual value and remaining to max
      backgroundColor: ['#FF6384', '#E0E0E0'], // Color for each section
      borderWidth: 0,
    }
    ];

}
