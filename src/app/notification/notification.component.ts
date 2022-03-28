import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader: ElementRef;
  [x: string]: any;
  searchForm: FormGroup;
  formvalidation: any = { submitted: false }
  recordArray: any = [];
  pageNumber = 1;
  limit: any;
  total: any;
  srNumber: any;
  dateValue: any;
  userId: any;
  id: any;
  nowDate2: any;
  editPriceForm: any;
  spinnerService: any;
  fileLength: any;
  todayDate: Date;
  productId: any



  constructor(public service: AppService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    this.searchFormVAlue()
    this.getViewData()

  }


  searchFormVAlue() {
    this.searchForm = new FormGroup({
      search: new FormControl(''),

    })
  }


  pagination(event) {
    this.pageNumber = event
    this.getViewData()
  }

  getViewData() {

    let apireq = {
      "limit": 10,
      "pageNumber": this.pageNumber,
      "search": "",
      sellerId: localStorage.getItem("_id")
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/getNotificationListForSeller', apireq, 0).subscribe((success: any) => {
      if (success.response_code == 200) {
        this.searchForm.reset()
        this.spinner.hide();
        this.recordArray = success.Data.docs;
        this.limit = success.Data.limit;
        this.total = success.Data.total;
        this.srNumber = (this.pageNumber - 1) * 10;
      }
      else {
        this.spinner.hide();
        this.service.err("Something went wrong")
      }
    }, error => {
      console.log(error)
      this.spinner.hide();
      this.service.err("Something went wrong")
    })
  }



  search(data) {

    let apireq = {
      "limit": 10,
      "pageNumber": this.pageNumber,
      "search": data.search,
      sellerId: localStorage.getItem("_id")

    }

    this.service.postApi('/api/v1/user/getNotificationListForSeller', apireq, 0).subscribe((success: any) => {
      if (success.response_code == 200) {
        this.spinner.hide();
        this.recordArray = success.Data.docs;
        this.limit = success.Data.limit;
        this.total = success.Data.total;
        this.srNumber = (this.pageNumber - 1) * 10;
      }
      else {
        this.service.err("Something went wrong")
      }
    }, error => {
      this.service.err("Something went wrong")
    })
  }



  DeleteModal(id) {
    this.id = id;
  }

  deleteApi() {

    let apireq = {
      "productId": this.id,
    }


    this.spinner.show();
    this.service.postApi('/api/v1/user/deleteProduct', apireq, 0).subscribe(success => {

      if (success.response_code == 200) {
        this.spinner.hide()
        this.service.succ(success.response_message)
        $('#DeleteModal').modal('hide')
        this.getViewData();

      }
      else {
        this.spinner.hide()
        this.service.err("Something went wrong")
      }
    }, error => {
      this.spinner.hide()
      this.service.err("Something went wrong")
    })
  }


  backClicked() {
    this._location.back();
  }



}
