import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $;

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader: ElementRef;
  @ViewChild('fileUploader1') fileUploader1: ElementRef;
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
  addCuisinForm: FormGroup;
  editCuisinForm: FormGroup;
  profileUrl: any = []
  activeImage: any = ''
  cuisineId: any




  constructor(public service: AppService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    this.searchFormVAlue()
    this.getViewData()
    this.addCuisinForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    })
    this.editCuisinForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    })

  }


  searchFormVAlue() {
    this.searchForm = new FormGroup({
      search: new FormControl(''),

    })
  }

  selectImages(event) {
    var urls = [];
    var file = event.target.files;
    if (file) {
      for (let files of file) {
        this.profileUrl.push(files)
        let reader = new FileReader();
        reader.onload = (e: any) => {
          urls.push(e.target.result);
          var urlsLength = urls.length
          if (urlsLength == file.length) {
            this.activeImage = urls[0]
            this.flag = 2
          }
        }
        reader.readAsDataURL(files);
      }

    }
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
      resAndStoreId: localStorage.getItem("_id")
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/getProductCategoryList', apireq, 0).subscribe((success: any) => {
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



  addCuisine() {

    this.spinner.show();
    this.formvalidation.submitted = true
    if (this.profileUrl.length == 0) {
      this.service.err("Image is mandatory")
      this.spinner.hide();
      return
    }
    if (this.addCuisinForm.invalid) {
      this.spinner.hide();
      return
    }
    let formData = new FormData()
    this.service.showSpinner()
    formData.append("name", this.addCuisinForm.value.name)
    formData.append("resAndStoreId", localStorage.getItem("_id"))
    if (this.profileUrl.length > 0) {
      formData.append(`image`, this.profileUrl[0])
    }

    this.service.formdataApi("/api/v1/user/addProductCategory", formData).subscribe((data: any) => {
      if (data.body.response_code == 200) {
        this.getViewData()
        $("#toggless").modal('hide')
        this.service.succ(data.body.response_message)
        this.fileUploader.nativeElement.value = null;
        this.profileUrl=[];
        this.activeImage = ''
        this.addCuisinForm.reset()
        this.service.hideSpinner()
      } else {
        this.service.hideSpinner()
        $("#toggless").modal('hide')
        this.profileUrl=[];
        this.fileUploader.nativeElement.value = null;
        this.activeImage = ''
        this.addCuisinForm.reset()
        this.service.succ("Something went wrong")
      }
    }, error => {
      console.log(error)
      this.service.hideSpinner()
      this.service.err("Something went wrong")
    })

  }

  toggles(x) {

    this.cuisineId = x._id
    this.activeImage = x.image
    this.editCuisinForm.patchValue(x)
  }

  editCuisine() {

    this.spinner.show();
    this.formvalidation.submitted = true
    if (this.editCuisinForm.invalid) {
      this.spinner.hide();
      return
    }
    let formData = new FormData()
    this.service.showSpinner()
    formData.append("name", this.editCuisinForm.value.name)
    formData.append("categoryId", this.cuisineId)
    if (this.profileUrl.length > 0) {
      formData.append(`image`, this.profileUrl[0])
    }

    this.service.formdataApi("/api/v1/user/updateProductCategory", formData).subscribe((data: any) => {
      if (data.body.response_code == 200) {
        this.getViewData()
        $("#toggles").modal('hide')
        this.service.succ(data.body.response_message)
        this.fileUploader1.nativeElement.value = null;
        this.activeImage = ''
        this.profileUrl=[];
        this.editCuisinForm.reset()
        this.service.hideSpinner()
      } else {
        this.service.hideSpinner()
        this.service.succ("Something went wrong")
      }
    }, error => {
      console.log(error)
      this.service.hideSpinner()
      this.service.err("Something went wrong")
    })
  }


  search(data) {

    let apireq = {
      "limit": 10,
      "pageNumber": this.pageNumber,
      "search": data.search,
      resAndStoreId: localStorage.getItem("_id")

    }

    this.service.postApi('/api/v1/user/getProductCategoryList', apireq, 0).subscribe((success: any) => {
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
      "categoryId": id,
      "status": status,
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/updateStatusProductCategory', apireq, 0).subscribe((success: any) => {
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

  updateOfferStatus(status, id) {

    let apireq = {
      "categoryId": id,
      "status": status,
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/updateOfferSeller', apireq, 0).subscribe((success: any) => {
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
      "categoryId": this.id,
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


  changeDate() {
    this.dateValue = new Date(this.searchForm.value.formDate)
  }

  backClicked() {
    this._location.back();
  }


  cancelModal() {
    this.formvalidation.submitted = false
    this.addOfferForm.reset()
    this.addCuisinForm.reset()
    this.editCuisinForm.reset()
    this.activeImage = ''
    this.fileUploader.nativeElement.value = null;
    this.fileUploader1.nativeElement.value = null;
    this.flag = 0

  }

}
