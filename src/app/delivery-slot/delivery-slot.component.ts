import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $;

@Component({
  selector: 'app-delivery-slot',
  templateUrl: './delivery-slot.component.html',
  styleUrls: ['./delivery-slot.component.scss']
})
export class DeliverySlotComponent implements OnInit {

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
  editSlotForm: FormGroup;
  addSlotForm: FormGroup;
  profileUrl: any=[]
  dayData = ['Monday', 'Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  slotData = ['Morning', 'Evening','Afternoon']
  activeImage: any = ''
  slotId:any



  constructor(public service: AppService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    this.searchFormVAlue()
    this.getViewData()

    this.editSlotForm = new FormGroup({
      openTime: new FormControl('', [Validators.required]),
      closeTime: new FormControl('', [Validators.required]),
      day: new FormControl('', [Validators.required]),
      timeSlot: new FormControl('', [Validators.required]),
    })
    this.addSlotForm = new FormGroup({
      openTime: new FormControl('', [Validators.required]),
      closeTime: new FormControl('', [Validators.required]),
      day: new FormControl('', [Validators.required]),
      timeSlot: new FormControl('', [Validators.required]),
      
    })

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
      sellerId:localStorage.getItem("_id")
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/getDeliverySlot', apireq, 0).subscribe((success: any) => {
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

  toggless(x){
    this.slotId=x._id,
    this.editSlotForm.patchValue(x)
  }

  editSlot(data) {
    this.spinner.show();
    this.formvalidation.submitted = true
    if (this.editSlotForm.invalid) {
      this.spinner.hide();
      return
    }
    let apireq = {
      slotId: this.slotId,
      openTime:data.openTime,
      closeTime:data.closeTime,
      day:data.day,
      timeSlot:data.timeSlot,
      
    }
    this.service.postApi("/api/v1/user/updateSlot", apireq,0).subscribe((data: any) => {
      if (data.response_code == 200) {
        this.router.navigate(['/slot'])
        this.editSlotForm.reset()
        $("#toggless").modal('hide')
        this.getViewData();
        this.service.succ(data.response_message)
        this.service.hideSpinner()
      } else {
        this.service.hideSpinner()
        this.service.succ(data.response_message)
      }
    }, error => {
      console.log(error)
      this.service.hideSpinner()
      this.service.err("Something went wrong")
    })

  }

 

  addSlot(data) {

    this.formvalidation.submitted = true
    if (this.addSlotForm.invalid) {
      this.spinner.hide();
      return
    }
    let apireq = {
      resAndStoreId: localStorage.getItem("_id"),
      openTime:data.openTime,
      closeTime:data.closeTime,
      day:data.day,
      timeSlot:data.timeSlot,
      
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/addDeliverySlot', apireq, 0).subscribe(success => {
      if (success.response_code == 200) {
        this.addSlotForm.reset()
        this.spinner.hide()
        this.service.succ(success.response_message)
        $('#toggles').modal('hide')
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


  search(data) {

    let apireq = {
      "limit": 10,
      "pageNumber": this.pageNumber,
      "search": data.search,
      sellerId:localStorage.getItem("_id")
     
    }

    this.service.postApi('/api/v1/user/getDeliverySlot', apireq, 0).subscribe((success: any) => {
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
      "slotId": id,
      "status": status,
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/updateSlotStatus', apireq, 0).subscribe((success: any) => {
      if (success.response_code == 200) {
        this.spinner.hide()
        this.getViewData()
        this.service.succ(success.response_message)
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

  DeleteModal(id) {
    this.id = id;
  }

  deleteApi() {

    let apireq = {
      "slotId": this.id,
    }


    this.spinner.show();
    this.service.postApi('/api/v1/user/deleteSlot', apireq, 0).subscribe(success => {

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


  changeDate() {
    this.dateValue = new Date(this.searchForm.value.formDate)
  }

  backClicked() {
    this._location.back();
  }



}
