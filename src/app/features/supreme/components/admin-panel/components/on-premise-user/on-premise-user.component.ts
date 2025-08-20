import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { MatPaginator } from "@angular/material/paginator";
import * as io from "socket.io-client";
import { environment } from "src/environments/environment";
import { SocketService } from "src/app/core/service/socket.service";

@Component({
  selector: "app-on-premise-user",
  templateUrl: "./on-premise-user.component.html",
  styleUrls: ["./on-premise-user.component.scss"],
})
export class OnPremiseUserComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ["id", "serverName", "status"];
  userData = new MatTableDataSource<any>([]);
  private socket;
  isDataLoading = true;

  constructor(
    private supremeService: SupremeService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private socketService: SocketService
  ) {
    this.socket = this.socketService.getSocket();
    this.socket.on(
      "getUsers",
      (data) => {
        this.isDataLoading = true;
        // console.log('data',data)
        this.userData.data = data;
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }
  ngAfterViewInit() {
    this.userData.paginator = this.paginator;
  }
  ngOnInit(): void {
    // this.getUserData();
  }
}
