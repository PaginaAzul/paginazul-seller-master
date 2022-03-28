import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $;
declare var google;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader: ElementRef;
  @ViewChild('fileUploader1') fileUploader1: ElementRef;
  searchForm: FormGroup;
  formvalidation: any = { submitted: false }
  
  signupForm: any;
  activeImage: any = ''
  imageToEdit: any = ''
  flag: number;
  buttonDisable: number;
  formdata = new FormData
  editformdata = new FormData
  fileLength: any;
  bannerId: any;
  schoolEditingId: any;
  index: any;
  advertisementData: any;
  appScreenName: any;
  region: any;
  time: any;
  todayDate: Date;
  pageData: any;
  commentData: any;
  categoryData = [{"english":'Grocery Store',port:"Lojas"}, {"english":'Restaurant',port:"Restaurante"}]
  activeImage1: any;
  map: any
  currentLat
  currentLong
  latitude: any
  longitude: any
  documentUrl: any=[]
  profileUrl: any=[]
  marked = false;
  theCheckbox = false;

  constructor(public service: AppService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private _location: Location) {
  }

  ngOnInit() {

    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/)]),
      mobileNumber: new FormControl('', [Validators.required,Validators.pattern(/^(\d*\.)?\d+$/),Validators.minLength(7), Validators.maxLength(15)]),
      storeType: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      confirmPassword: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
    })
  }

  focusFunction(varids) {
    var sourcePlace = document.getElementById(varids);
    var autocomplete = new google.maps.places.Autocomplete(sourcePlace);
    autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name', 'formatted_address']);
    var infowindow = new google.maps.InfoWindow();
    autocomplete.addListener('place_changed', () => {
      var placeOne = autocomplete.getPlace();
      if (!placeOne.geometry) {
        window.alert("No details available for input: '" + placeOne.name + "'");
        return;
      }
      var address = '';
      if (placeOne.address_components) {
        address = [
          (placeOne.address_components[0] && placeOne.address_components[0].short_name || ''),
          (placeOne.address_components[1] && placeOne.address_components[1].short_name || ''),
          (placeOne.address_components[2] && placeOne.address_components[2].short_name || '')
        ].join(' ');
      }
      this.latitude = placeOne.geometry.location.lat();
      this.longitude = placeOne.geometry.location.lng();
      this.signupForm.patchValue({
        address: placeOne.formatted_address
      })

    });
  }

  toggleVisibility(e){
    this.marked= e.target.checked;
  }

  open(a){
    window.open(a)
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

  selectImages1(event) {
    var urls = [];
    var file = event.target.files;
    if (file) {
      for (let files of file) {
        this.documentUrl.push(files)
        let reader = new FileReader();
        reader.onload = (e: any) => {
          urls.push(e.target.result);
          var urlsLength = urls.length
          if (urlsLength == file.length) {
            this.activeImage1 = urls[0]
            this.flag = 2
          }
        }
        reader.readAsDataURL(files);
      }
     
    }
  }

  signupSubmit() {

    
    this.spinner.show();
    this.formvalidation.submitted = true
    if(this.profileUrl.length==0){
      this.service.err("Restaurant/Store image is mandatory")
      this.spinner.hide();
      return;
    }
    if(this.documentUrl.length==0){
      this.service.err("Document is mandatory")
      this.spinner.hide();
      return;
    }
    if (this.activeImage == '') {
      this.flag = 1
      this.spinner.hide();
      return
    }
    if (this.activeImage1 == '') {
      this.flag = 1
      this.spinner.hide();
      return
    }
    else {
      this.flag = 2
    }
    
    if (this.signupForm.invalid) {
      this.spinner.hide();
      return
    }
    if(this.marked==false){
      this.service.err("Please accept terms & conditions")
      this.spinner.hide();
      return
    }
    let formData = new FormData()
    this.service.showSpinner()
    formData.append("name", this.signupForm.value.name)
    formData.append("email", this.signupForm.value.email)
    formData.append("mobileNumber", this.signupForm.value.mobileNumber)
    formData.append("address", this.signupForm.value.address)
    formData.append("password", this.signupForm.value.password)
    formData.append("storeType", this.signupForm.value.storeType)
    formData.append("latitude", this.latitude)
    formData.append("longitude", this.longitude)
    formData.append("countryCode", '+91')
    formData.append(`image`, this.profileUrl[0])
    formData.append(`document`, this.documentUrl[0])
    this.service.formdataApi("/api/v1/user/sellerSignup", formData).subscribe((result: any) => {
      if (result.body.status == "SUCCESS") {
        this.router.navigate(['/'])
        this.service.succ(result.body.response_message)
        this.service.hideSpinner()
      } else {
        this.service.hideSpinner()
        this.service.succ(result.body.response_message)
      }
    }, error => {
      console.log(error)
      this.service.hideSpinner()
      this.service.err("Something went wrong")
    })

  }
  backClicked() {
    this._location.back();
  }

}
