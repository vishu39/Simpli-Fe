import { Component, OnInit } from '@angular/core';
import { forkJoin, fromEvent, take } from 'rxjs';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  constructor() { }
  createdAt:Date | string = new Date().toISOString();
  isDetails:boolean = true;
  ngOnInit(): void {}
  myFunction(){
    // console.log('click');
  }
}
