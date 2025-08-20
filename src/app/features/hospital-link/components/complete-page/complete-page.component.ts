import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-page',
  templateUrl: './complete-page.component.html',
  styleUrls: ['./complete-page.component.scss']
})
export class CompletePageComponent implements OnInit {
  @Input() message: string

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    localStorage.clear()
    this.router.navigate(["/hospital/hospital-login"])
  }

}
