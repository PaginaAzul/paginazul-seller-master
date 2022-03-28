import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

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
  profileUrl: any=[]
  activeImage: any = ''
  slotId:any
  type:any='Current'



  constructor(public service: AppService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.todayDate = new Date()
    this.searchFormVAlue()
    this.getViewData()

  }


  Changed(event) {
    if (event) {
      this.nowDate2 = event;
    }
    else {
      this.nowDate2 = ''
    }
  }
  searchFormVAlue() {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    })
  }

  getType(data){
    this.type=data
    this.getViewData()
  }



  pagination(event) {
    this.pageNumber = event
    this.getViewData()
  }

  getViewData() {

    let apireq = {
      "limit": 100,
      "pageNumber": this.pageNumber,
      "search": "",
      type:this.type,
      sellerId:localStorage.getItem("_id")
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/getOrderForSeller', apireq, 0).subscribe((success: any) => {
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
      "limit": 100,
      "pageNumber": this.pageNumber,
      "search": data.search,
      "startDate": (data.startDate == '' || data.startDate == undefined) ? '' : (new Date(data.startDate).toISOString()),
      "endDate": (data.endDate == '' || data.endDate == undefined) ? '' : (new Date(new Date(data.endDate).getTime() + 24 * 60 * 60 * 1000).toISOString()),
      type:this.type,
      sellerId:localStorage.getItem("_id")
     
    }

    this.service.postApi('/api/v1/user/getOrderForSeller', apireq, 0).subscribe((success: any) => {
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



  blockApi(status, id) {

    let apireq = {
      "orderId": id,
      "status": status,
      sellerId:localStorage.getItem("_id")
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/updateOrderStatus', apireq, 0).subscribe((success: any) => {
      if (success.response_code == 200) {
        this.spinner.hide()
        this.getViewData()
        this.service.succ(success.response_message)
      }
      else {
        this.spinner.hide()
        this.service.err(success.response_message)
      }
    }, error => {
      this.spinner.hide()
      this.service.err("Something went wrong")
    })
  }


  changeDate() {
    this.dateValue = new Date(this.searchForm.value.formDate)
  }

  backClicked() {
    this._location.back();
  }



}
