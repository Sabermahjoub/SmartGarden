import { Component, OnInit, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {Chart} from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateHourTempService } from 'src/app/services/date-hour-temp.service';
import { PlantsService } from 'src/app/services/plants.service';
import { plant } from 'src/app/models/plant';

import { WeatherApiData, backendData } from 'src/app/models/weather_data';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { CreatePlantComponent } from '../create-plant/create-plant.component';
import { ConfirmDialogueComponent } from '../confirm-dialogue/confirm-dialogue.component';

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
    private plantsService : PlantsService,
    private datePipe : DatePipe,
    private dialog : MatDialog
  ) { 
  }

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;


  selectedPlant : plant = {
    plant_name : "",
    minTemp_day : 0,
    maxTemp_day : 0,    
    minTemp_night : 0,
    maxTemp_night : 0,
    minHumidity : 0,
    maxHumidity: 0,
    Wind : "",
    minUVIndex : 0,
    maxUVIndex : 0,
    minLight : 0,
    maxLight : 0,
    minSoilMoisture : 0,
    maxSoilMoisture : 0,
    lastDateOfIrrigation : "",
    lastDateOfFertilizer : "",
    lastDateOfPesticide : "",
    lastDateOfNutrients : "",
  };

  allPlants : plant[] = [] ;

  
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

  getAllPlants() : void {
    this.plantsService.getAllPlants().subscribe( response =>{
      if(response.plants) {
        this.allPlants = response.plants;
        console.log("Get All plants result : ",this.allPlants);
      }
      else {
        console.log("error ");
      }

    });
  }

  ngOnInit(): void {

    this.getAllPlants();

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

  selectPlant(selectedPlant : any): void {
    this.selectedPlant = selectedPlant;
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
    const dialogRef = this.dialog.open(CreatePlantComponent, {
      maxHeight: '90vh', 
      height: '90%',
      minHeight: '450px',
      minWidth: '750px',
      width: '50%',
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllPlants();
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

  onDelete(plantName : string) : void {

    const deleteDialog = this.dialog.open(ConfirmDialogueComponent, {
      width: '500px',
      panelClass: 'custom-confirm-dialog-container',
      data: { 
        title: 'Confirm deletion', 
        message: 'Are you sure you want to delete this plant?' 
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      // User confirmed the action 
      if (result) {
        this.plantsService.deletePlant(plantName).subscribe(response => {
          console.log("RESPONSE DELETE / ",response);
          if (response.error) {
            this.snackBar.open(
              'Error occurred while trying to delete plant. Try again !',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-red-style'],
              }
            );
          }
          else {
            this.snackBar.open(
              'Plant successfully deleted.',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-style'],
              }
            );
            this.getAllPlants();

          }
        });
      } else {
        console.log('User canceled the deletion');
      }
    });

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
