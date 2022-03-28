import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-business-owner-profile',
  templateUrl: './business-owner-profile.component.html',
  styleUrls: ['./business-owner-profile.component.scss']
})
export class BusinessOwnerProfileComponent implements OnInit {
  @ViewChild('slide', { static: true }) slide: ElementRef;
  profilePic = localStorage.getItem("profilePic")
  name = localStorage.getItem("name")
  storeType = localStorage.getItem("type")
  sellerId = localStorage.getItem("_id")
  sellerRecord: any
  changePasswordForm: FormGroup
  pageNumber = 1;
  limit: any;
  searchForm: FormGroup;
  total: any;
  srNumber: any;
  recordArray: any = [];
  nowDate2: any;
  fileLength: any;
  todayDate: Date;

  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private service: AppService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.todayDate = new Date()
    this.searchFormVAlue()
    this.sellerData()
    this.getViewData()
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      confirmPassword: new FormControl('', [Validators.required])
    })
  }

  open(a) {
    window.open(a)
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
      startDate: new FormControl(''),
      endDate: new FormControl('')
    })
  }

  sellerData() {
    let apiReq =
    {
      "sellerId": localStorage.getItem('_id'),
    }
    this.service.postApi('/api/v1/user/getSellerDetail', apiReq, 0).subscribe((res: any) => {
      if (res.response_code == 200) {
        this.sellerRecord = res.Data;

      }
    }, error => {
      this.service.err("Something went wrong")
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
    this.service.postApi('/api/v1/user/getPaymentListForSeller', apireq, 0).subscribe((success: any) => {
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
      "startDate": (data.startDate == '' || data.startDate == undefined) ? '' : (new Date(data.startDate).toISOString()),
      "endDate": (data.endDate == '' || data.endDate == undefined) ? '' : (new Date(new Date(data.endDate).getTime() + 24 * 60 * 60 * 1000).toISOString()),
      sellerId: localStorage.getItem("_id")

    }

    this.service.postApi('/api/v1/user/getPaymentListForSeller', apireq, 1).subscribe((success: any) => {
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

  updateNotificationApi(event) {
    let apiData = {
      notificationStatus: event.checked
    }
    this.service.showSpinner()
    this.service.postApi('/api/v1/user/updateNotificationStatus', apiData, 0).subscribe((success) => {
      if (success.response_code == 200) {
        this.sellerData()
        this.service.hideSpinner()
        this.service.succ(success.response_message)
      }
      else {
        this.service.err(success.response_message)
        this.service.hideSpinner()
      }
    }, error => {
      this.service.err('Something went wrong')
      this.service.hideSpinner()
    })
  }

  editProfile(data) {

    this.spinner.show();
    if (this.changePasswordForm.invalid) {
      this.spinner.hide();
      return
    }

    let apireq = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      sellerId: localStorage.getItem("_id")
    }
    this.service.postApi('/api/v1/user/sellerChangePassword', apireq, 0).subscribe(success => {
      if (success.response_code == 200) {
        this.service.succ(success.response_message);
        this.spinner.hide();
        this.router.navigate([''])
      }
      else if (success.response_code == 500) {
        this.service.err(success.response_message);
        this.changePasswordForm.reset();
        this.spinner.hide();
      }
    }, error => {
      console.log("Something went wrong")
    })
  }

  logout() {
    let apiReq =
    {
      "sellerId": localStorage.getItem('_id'),
    }
    this.service.postApi('/api/v1/user/sellerLogout', apiReq, 0).subscribe((res: any) => {
      if (res.response_code == 200) {
        localStorage.clear()
        this.router.navigate(['/'])
        this.service.succ(res.response_message)
      }
    }, error => {
      this.service.err("Something went wrong")
    })
  }

}
