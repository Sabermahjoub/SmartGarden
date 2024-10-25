import { Component, OnInit, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {Chart} from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer; // Access drawer using the #drawer template reference
  constructor(
    private snackBar: MatSnackBar
  ) { }

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

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

  // public doughnutChartLabels: string[] = ['UV Index'];
  // public doughnutChartData: number[] = [70, 30];  // 70% full, 30% empty for gauge
  // public doughnutChartType: string = 'doughnut';

  // // Datasets with data and colors
  // public doughnutChartDatasets: any[] = [
  //   {
  //     data: this.doughnutChartData,
  //     backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(200, 200, 200, 0.3)'], // Colors for filled and empty sections
  //     hoverBackgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(200, 200, 200, 0.3)'], // Hover colors (optional)
  //     borderWidth: 0
  //   }
  // ];

  // // Chart options for a gauge-like appearance
  // public doughnutChartOptions: any = {
  //   circumference: Math.PI,  // Makes it half-circle
  //   rotation: Math.PI,       // Rotates the chart so it starts from the top
  //   cutoutPercentage: 70,    // This controls how "thick" the doughnut is
  //   responsive: true,
  //   plugins: {
  //     tooltip: {
  //       enabled: false  // Optionally disable tooltips
  //     }
  //   }
  // };
  public doughnutChartLabels: string[] = [];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [7, 3], // Actual value and remaining to max
      backgroundColor: ['#FF6384', '#E0E0E0'], // Color for each section
      borderWidth: 0,
    }
    ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    //cutout: '60%', // Creates a hollow center for the gauge effect
    //rotation: Math.PI, // Start from the left side
    //circumference: Math.PI, // Display only half of the doughnut
    plugins: {
        legend: {
            display: false // Hide legend if not needed
        },
    },
    
  };

}
