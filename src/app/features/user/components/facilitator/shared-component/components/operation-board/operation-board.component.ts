import { Component, OnInit } from "@angular/core";

@Component({
  selector: "shared-operation-board",
  templateUrl: "./operation-board.component.html",
  styleUrls: ["./operation-board.component.scss"],
})
export class OperationBoardComponent implements OnInit {
  constructor() {}
  currentDate = new Date();
  ngOnInit(): void {}
}
