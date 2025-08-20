import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matRef:MatDialogRef<GenericDialogComponent>
  ) { }
  ngOnInit(): void {}
  btnEvent(e:any,btn:any){
    let data = {$event:e,button:btn};
    this.matRef.close(data)
  }
}
