import { Injectable } from '@angular/core'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { GenericDialogComponent } from '../components/generic-dialog/generic-dialog.component'

export interface InformData {
  title?: string
  message?: string,
}

@Injectable({
  providedIn: 'root'
})

export class UIService {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  snackbarConfig: MatSnackBarConfig = {
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
  }
  flashSuccess(messages: string[] | string | any): void {
    if(messages && (messages === '' || messages === undefined)) return
    this.snackBar.open(messages, '', { ...this.snackbarConfig,panelClass:'snackBar-success', duration: 2000 }) 
  }
  flashError(messages: string[] | string | any,button:any): void {
    if(messages && (messages === '' || messages === undefined)) return
    let errorSnackBar =  this.snackBar.open(messages, button , {...this.snackbarConfig,panelClass:'snackBar-danger'})
    //  errorSnackBar.onAction().subscribe(() => {})
  }
  warnDialog(messages: string[] | string | any,buttons:any[],width:number){
    let data = {messages,buttons}
    let dialog = this.dialog.open(GenericDialogComponent,{data:data,width:`${width *10}vw`,exitAnimationDuration:'0ms', enterAnimationDuration:'0ms',disableClose:true})
    return dialog.afterClosed()
  }
}