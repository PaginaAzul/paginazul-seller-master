import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  storeType=localStorage.getItem("type")
  constructor() { }

  ngOnInit(): void {
  }
  open(a){
    window.open(a)
  }

}
