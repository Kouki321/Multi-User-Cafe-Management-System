import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/globa-constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent{// implements AfterViewInit {
  responseMessage: any;
  data: any;

  constructor(
    private dashboardService: DashboardService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {
    this.ngxService.start();
    this.loadDashboardData();
  }

  //ngAfterViewInit() {}

  loadDashboardData() {
    this.dashboardService.getDetails().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.data = response;
     //   console.log('Dashboard data: ', this.data);
      },
      (error: any) => {
        this.ngxService.stop();
      //  console.error('Error fetching dashboard data: ', error);
       // console.log('Full error details: ', JSON.stringify(error, null, 2));
        this.responseMessage =
          error.error?.message || GlobalConstants.genericError;
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }
}
