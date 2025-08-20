import { Component, OnInit, ViewChild } from "@angular/core";
import { ChatsComponent } from "./component/chats/chats.component";

@Component({
  selector: "shared-message-fetch",
  templateUrl: "./message-fetch.component.html",
  styleUrls: ["./message-fetch.component.scss"],
})
export class MessageFetchComponent implements OnInit {
  constructor() {}

  @ViewChild(ChatsComponent)
  chatsComponent!: ChatsComponent;

  ngOnInit(): void {}

  reload() {
    this.chatsComponent.refreshAllApis();
  }
}
