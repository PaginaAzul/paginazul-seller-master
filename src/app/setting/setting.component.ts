import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $:any

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
 
  id: any;
  userDetail: any;
  changePasswordForm: FormGroup
 
  
  constructor(
    public router: Router,
    private spinner: NgxSpinnerService, 
    public service: AppService
    ) { }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      confirmPassword: new FormControl('', [Validators.required])
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
      newPassword: data.newPassword
    }
    this.service.postApi('/api/v1/admin/passwordChange', apireq, 1).subscribe(success => {
      if (success.status == 200) {
        this.spinner.hide();
      this.router.navigate([''])
      } 
      else if(success.status == 400) {
        this.service.err(success.message);
        this.changePasswordForm.reset();
        this.spinner.hide();
      }
    }, error => {
      console.log("Something went wrong")
    })
  }


}
