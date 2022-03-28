import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {

  forgotPasswordMain: FormGroup

  constructor(
    private route: Router,
    private service: AppService
    ) { }

  ngOnInit() {
    this.forgotPasswordMain = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/)])
    });
  }

   forgotFunction(forgotData) {
    if (this.forgotPasswordMain.invalid) {
      return
    }
   
    let apiData = {
      "email": forgotData.email
    }
    this.service.postApi('/api/v1/user/selerForgotPassword', apiData, 0).subscribe((success) => {
      if (success.response_code == 200) {
        this.service.succ(success.response_message)
        this.route.navigate(['/'])
       
      }
      else {
        if (success.response_code == 500) {
          this.service.err(success.response_message)
        } else {
          this.service.err(success.response_message)
        }
      }
    }, error => {
      this.service.err("something went wrong")
    })
  }

}
