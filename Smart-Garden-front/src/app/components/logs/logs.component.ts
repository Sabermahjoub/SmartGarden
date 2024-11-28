import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogueComponent } from '../confirm-dialogue/confirm-dialogue.component';
import { LogsService } from 'src/app/services/logs.service';

export interface PeriodicElement {
  plant_name: string;
  id: number;
  date: string;
  operation: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, plant_name: 'Tomato', date: "28/10/2024", operation: 'Fertilizer'},
  {id: 2, plant_name: 'Tomato', date: "28/11/2024", operation: 'Watering'},
  {id: 3, plant_name: 'Potato', date: "27/11/2024" , operation: 'Pesticides'},
  {id: 4, plant_name: 'Carrot', date: "26/11/2024" , operation: 'Pesticides'},
  {id: 5, plant_name: 'Chickpea', date: "28/11/2024", operation: 'Fertilizer'},
  {id: 6, plant_name: 'Pea', date: "21/11/2024", operation: 'Watering'},
  {id: 7, plant_name: 'Pepper', date: "24/11/2024", operation: 'Fertilizer'},
  {id: 8, plant_name: 'Oxygen', date: "21/11/2024", operation: 'Pesticides'},
  {id: 9, plant_name: 'Chickpea', date: "23/11/2024", operation: 'Fertilizer'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},
  {id: 10, plant_name: 'All', date: "20/11/2024", operation: 'Watering'},

];
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'plant_name', 'date', 'operation', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private dialog : MatDialog,
    private logsServices : LogsService) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: any) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnInit(): void {
  }

  onDelete(id : number) : void {

    const deleteDialog = this.dialog.open(ConfirmDialogueComponent, {
      width: '500px',
      panelClass: 'custom-confirm-dialog-container',
      data: { 
        title: 'Confirm deletion', 
        message: 'Are you sure you want to delete this log?' 
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      if (result) {
        this.logsServices.deleteLogs(id).subscribe( response => {
          

        }

        )
      }
      else {

      }
    });
  }

}
