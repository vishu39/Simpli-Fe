import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddCommentsDialogComponent } from "../../../operation-board/dialog/add-comments-dialog/add-comments-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-comment-list",
  templateUrl: "./comment-list.component.html",
  styleUrls: ["./comment-list.component.scss"],
})
export class CommentListComponent implements OnInit {
  chatArray = [];
  isCommentLoading: boolean = false;
  totalChatElement: number;
  commentParams = {
    page: 1,
    limit: 10,
    isNotification: false,
    search: "",
  };
  timeoutComment = null;

  @ViewChild("scrollMe") private myScrollContainer: ElementRef;

  constructor(
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {
    // this.sharedService.realTimeNotificationSubject.subscribe((pn: any) => {
    //   if (!!pn) {
    //     this.chatArray.unshift(pn);
    //   }
    // });
  }

  ngOnInit(): void {
    this.getComment();
  }

  scrollCalled: boolean = false;
  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight;
        this.scrollCalled = true;
      } catch (err) {}
    }, 100);
  }

  getComment() {
    this.isCommentLoading = true;
    this.facilitatorService.getAllComment(this.commentParams).subscribe(
      (res: any) => {
        let data = res?.data;
        this.chatArray.push(...data?.content);
        this.commentParams.page = this.commentParams.page + 1;
        this.totalChatElement = data?.totalElement;
        this.isCommentLoading = false;
        if (!this.scrollCalled) {
          this.scrollToBottom();
        }
      },
      (err) => {
        this.isCommentLoading = false;
      }
    );
  }

  isDark() {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
      return true;
    } else {
      return false;
    }
  }

  onInfiniteScrollComment(): void {
    if (!this.isCommentLoading) {
      if (this.chatArray.length < this.totalChatElement) {
        this.getComment();
      }
    }
  }

  searchComment(filterValue: string) {
    clearTimeout(this.timeoutComment);
    this.timeoutComment = setTimeout(() => {
      this.commentParams.search = filterValue.trim();
      this.commentParams.page = 1;
      this.chatArray = []; // Clear existing data when searching
      this.isCommentLoading = false;
      this.getComment();
    }, 600);
  }

  openCommentModal(item: any) {
    const dialogRef = this.dialog.open(AddCommentsDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        itemData: item,
        title: "Comment",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
