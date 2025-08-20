import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/smvt-framework/services/common.service";
// import { OperationDialogComponent } from "./operation-dialog/operation-dialog.component";
import { operationDemo } from "./operation-board";

@Component({
  selector: "app-operation-board",
  templateUrl: "./operation-board.component.html",
  styleUrls: ["./operation-board.component.scss"],
})
export class OperationBoardComponent implements OnInit {
  constructor(private svc: CommonService) {}
  currentDate = new Date();
  ngOnInit(): void {}

  items = [
    "Carrots",
    "Tomatoes",
    "Onions",
    "Apples",
    "Avocados",
    "Carrots",
    "Tomatoes",
    "Onions",
    "Apples",
    "Avocados",
  ];

  basket = ["Oranges", "Bananas", "Cucumbers"];

  operationDemo = operationDemo;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  dialog(item: any, title: string) {
    //   let dialogData = { itemData: item, title };
    //   this.svc.dialog.open(OperationDialogComponent, {
    //     data: dialogData,
    //     height: "90vh",
    //     width: "100vw",
    //     disableClose: true,
    //   });
  }
}
