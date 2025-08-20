import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MessageService } from "src/app/core/service/message/message.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { FormControl } from "@angular/forms";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import * as moment from "moment";

@Component({
  selector: "shared-chats",
  templateUrl: "./chats.component.html",
  styleUrls: ["./chats.component.scss"],
})
export class ChatsComponent implements OnInit {
  tokenData: any = this.sharedService.decodeToken();

  constructor(
    private sharedService: SharedService,
    private messageService: MessageService,
    private facilitatorService: FacilitatorService
  ) {}

  ngOnInit(): void {
    this.getMessageFetch();
  }

  refreshAllApis() {
    this.rightSideFullReset();
    this.leftSideFullReset();
    // this.choosedDefaultCommunicationMessageControl.setValue(null);
    // this.messageSettingByUserData = [];
    // this.messageCommunicationDefaultMessageData = [];
    // this.selectedDefaultCommunicationMessageObj = {};
    this.getMessageFetch();
  }

  getMessageFetch() {
    this.facilitatorService.getMessageFetch().subscribe((res: any) => {
      if (!res.isError) {
        this.getAllMessageSettingByUserForHospital(this.tokenData?.userId);
      }
    });
  }

  // default Message cummunication start
  choosedDefaultCommunicationMessageControl: any = new FormControl(null, []);
  messageSettingByUserData: any = [];
  messageCommunicationDefaultMessageData: any = [];

  selectedDefaultCommunicationMessageObj: any = {};

  getAllMessageSettingByUserForHospital(id: any) {
    this.facilitatorService.getAllMessageSettingByUser(id).subscribe(
      (res: any) => {
        this.messageSettingByUserData = res?.data;
        if (this.messageSettingByUserData?.length) {
          this.choosedDefaultCommunicationMessageControl.setValue(
            this.selectedDefaultCommunicationMessageObj?.messageId
              ? this.selectedDefaultCommunicationMessageObj?.messageId
              : this.messageSettingByUserData[0]?.messageId
          );
          this.selectedDefaultCommunicationMessageObj = this
            .selectedDefaultCommunicationMessageObj?.messageId
            ? this.selectedDefaultCommunicationMessageObj
            : this.messageSettingByUserData[0];
          this.refreshMessageFetchApis();
        }
      },
      (err) => {}
    );
  }

  selectDefaultCommunicationMessage() {
    let defaultMessageIndex = this.messageSettingByUserData?.findIndex(
      (item: any) =>
        item?._id ===
        this.messageCommunicationDefaultMessageData?.defaultMessage
    );

    if (defaultMessageIndex !== -1) {
      this.choosedDefaultCommunicationMessageControl.setValue(
        this.messageSettingByUserData[defaultMessageIndex]?.messageId
      );
    } else {
      this.choosedDefaultCommunicationMessageControl.setValue("");
    }
  }

  onDefalutMessageSelectionChange(event: any) {
    let { value } = event;
    let selectedMessageObj = this.messageSettingByUserData?.find(
      (item: any) => item?.messageId === value
    );

    this.selectedDefaultCommunicationMessageObj = selectedMessageObj;
    this.refreshMessageFetchApis();
  }

  // default Message cummunication end

  refreshMessageFetchApis() {
    this.rightSideFullReset();
    this.leftSideFullReset();

    this.getAllContact();
    this.getAllChats();
  }

  contactParams = {
    page: 1,
    offset: 0,
    limit: 2000,
  };

  isContactLoading = false;
  contactData: any = [];
  freshContactData: any = [];
  previousContactArrayLength: number = 0;
  timeoutContactProfile = null;

  contactMap: Map<string, any> = new Map();

  getAllContact() {
    if (this.isContactLoading) {
      return;
    }

    this.isContactLoading = true;
    this.messageService
      .getAllContact(
        this.contactParams,
        this.selectedDefaultCommunicationMessageObj?.messageId,
        this.selectedDefaultCommunicationMessageObj?.accessToken
      )
      .subscribe(
        (res: any) => {
          this.previousContactArrayLength = this.contactData?.length;
          this.contactData.push(...res?.contacts);
          this.freshContactData.push(...res?.contacts);

          if (this.contactData?.length) {
            this.contactData.forEach((contact: any) => {
              if (contact?.contact_id) {
                this.contactMap.set(contact.contact_id, contact);
              }
            });
          }

          // this.contactParams.page = this.contactParams.page + 1;
          this.isContactLoading = false;
        },
        (err) => {
          this.isContactLoading = false;
        }
      );
  }

  chatsParams = {
    page: 1,
    offset: 0,
    limit: 2000,
    chat_type: ["group", "individual", "business"],
    label: "",
  };

  isChatLoading = false;
  chatsData: any = [];
  freshChatsData: any = [];
  previousChatArrayLength: number = 0;
  timeoutChatProfile = null;

  messageMediaObj = {
    image: {
      icon: "camera_alt",
      title: "Photo",
    },
    document: {
      icon: "insert_drive_file",
      title: "Document",
    },
    video: {
      icon: "play_arrow",
      title: "Video",
    },
  };

  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  scrollCalled: boolean = false;
  isScrollWorking = false;
  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight;
        this.scrollCalled = true;
        this.isScrollWorking = false;
      } catch (err) {}
    }, 0);
  }

  scrollMidCalled: boolean = false;
  scrollToMid(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight /
          this.chatsMessageParams.page;
        this.scrollMidCalled = true;
      } catch (err) {}
    }, 100);
  }

  getAllChats() {
    if (this.isChatLoading) {
      return;
    }

    this.isChatLoading = true;
    this.messageService
      .getAllChats(
        this.chatsParams,
        this.selectedDefaultCommunicationMessageObj?.messageId,
        this.selectedDefaultCommunicationMessageObj?.accessToken
      )
      .subscribe(
        (res: any) => {
          this.previousChatArrayLength = this.chatsData?.length;
          this.chatsData.push(...res?.chats);
          this.freshChatsData.push(...res?.chats);
          this.sortChatsByLatest(this.chatsData);
          this.chatsParams.page = this.chatsParams.page + 1;
          this.isChatLoading = false;
        },
        (err) => {
          this.isChatLoading = false;
        }
      );
  }

  sortChatsByLatest(chats: any[]): any[] {
    return chats.sort((a: any, b: any) => {
      const lastADate = a?.latest_message?.timestamp;
      const lastBDate = b?.latest_message?.timestamp;

      if (!lastADate && !lastBDate) return 0; // Both are missing
      if (!lastADate) return 1; // Move `a` down
      if (!lastBDate) return -1; // Move `b` down

      // Use direct date comparison
      const dateA = new Date(lastADate).getTime();
      const dateB = new Date(lastBDate).getTime();

      // Fallback to string comparison if dates are invalid
      if (isNaN(dateA) || isNaN(dateB)) {
        return lastBDate.localeCompare(lastADate);
      }

      return dateB - dateA;
    });
  }

  onInfiniteScrollChats(): void {
    // if (this.previousChatArrayLength < this.chatsData.length) {
    //   this.getAllChats();
    // }
  }

  searchChatProfile(filterValue: string) {
    clearTimeout(this.timeoutChatProfile);
    this.timeoutChatProfile = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshChatsData);
        this.chatsData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.chat_name
            ?.toLowerCase()
            .includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.chatsData = filterArray;
        this.sortChatsByLatest(this.chatsData);
        this.rightSideFullReset();
      } else {
        this.chatsData = this.freshChatsData;
        this.sortChatsByLatest(this.chatsData);
        this.rightSideFullReset();
      }
    }, 600);
  }

  selectedProfile: any = {};
  isProfileSelected = false;
  onClickChatProfile(item: any) {
    if (!this.isChatMessagesLoading) {
      if (this?.selectedProfile?.chat_id !== item?.chat_id) {
        this.rightSideFullReset();
        this.chatMessagesData = [];
        this.chatsMessageParams.page = 1;
        this.scrollCalled = false;
        this.selectedProfile = item;
        this.isProfileSelected = true;
        this.getAllChatsMessagesByChatId(item);
      }
    } else {
      // this.sharedService.showNotification(
      //   "snackBar-danger",
      //   "Slow down! Let the current chat load first."
      // );
    }
  }

  chatsMessageParams = {
    page: 1,
    offset: 0,
    limit: 50,
  };

  isChatMessagesLoading = false;
  chatMessagesData: any = [];
  previousChatMessageArrayLength = 0;
  isNewMessagesFound = false;

  getAllChatsMessagesByChatId(item: any) {
    if (this.isChatMessagesLoading) {
      return;
    }

    this.isChatMessagesLoading = true;
    const chatElements = document.querySelectorAll(".chat");
    chatElements.forEach((chat) => {
      if (this.isChatMessagesLoading) {
        (chat as HTMLElement).style.pointerEvents = "none";
        (chat as HTMLElement).style.cursor = "not-allowed";
        (chat as HTMLElement).style.opacity = "0.6";
      }
    });

    this.messageService
      .getAllChatsMessagesByChatId(
        item?.chat_id,
        this.chatsMessageParams,
        this.selectedDefaultCommunicationMessageObj?.messageId,
        this.selectedDefaultCommunicationMessageObj?.accessToken
      )
      .subscribe(
        (res: any) => {
          let data = res?.messages;
          let chats = cloneDeep(data);
          const sortedMessages = chats.reverse();
          if (sortedMessages?.length) {
            this.isNewMessagesFound = true;
          } else {
            this.isNewMessagesFound = false;
          }
          this.previousChatMessageArrayLength = this.chatMessagesData?.length;
          this.chatMessagesData = [...sortedMessages, ...this.chatMessagesData];

          this.chatMessagesData?.forEach((item: any) => {
            let itemArray = [];
            if (
              !!item?.media?.filename &&
              !!item?.media?.mimetype &&
              !!item?.media?.path
            ) {
              let obj = {
                originalname: item?.media?.filename,
                mimetype: item?.media?.mimetype,
                signedUrl: item?.media?.path,
              };
              itemArray.push(obj);
            }

            item["mediaArray"] = itemArray;
          });

          this.chatsMessageParams.page = this.chatsMessageParams.page + 1;

          this.isChatMessagesLoading = false;

          chatElements.forEach((chat) => {
            if (!this.isChatMessagesLoading) {
              (chat as HTMLElement).style.pointerEvents = "auto";
              (chat as HTMLElement).style.cursor = "pointer";
              (chat as HTMLElement).style.opacity = "1";
            }
          });
          if (!this.scrollCalled) {
            this.scrollToBottom();
          }
          if (!this.scrollMidCalled && this.scrollCalled) {
            if (this.isNewMessagesFound) {
              this.scrollToMid();
            }
          }
        },
        () => {
          this.isChatMessagesLoading = false;
        }
      );
  }

  onInfiniteScrollChatMessages(): void {
    if (this.previousChatMessageArrayLength < this.chatMessagesData.length) {
      if (this.isNewMessagesFound) {
        this.scrollMidCalled = false;
      }
      this.getAllChatsMessagesByChatId(this.selectedProfile);
    }
  }

  getChatPersonName(senderId: string) {
    const chatPersonObj = this.contactMap.get(senderId);
    return chatPersonObj?.contact_name || chatPersonObj?.number || "User";
  }

  // date label function start
  // Check if the date label should be shown
  shouldShowDateLabel(index: number): boolean {
    if (index === 0) {
      return true;
    }

    const currentMessageDate = this.getTimeStampInDateFormat(
      this.chatMessagesData[index]?.timestamp
    );
    const previousMessageDate = this.getTimeStampInDateFormat(
      this.chatMessagesData[index - 1]?.timestamp
    );

    return currentMessageDate !== previousMessageDate;
  }

  getTimeStampInDateFormat(timeStamp: any) {
    let date = new Date(timeStamp);
    return date.toISOString().split("T")[0];
  }

  getFormattedDate(timestamp: Date): string {
    const date = moment(timestamp);
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");

    if (date.isSame(today, "day")) {
      return "Today";
    } else if (date.isSame(yesterday, "day")) {
      return "Yesterday";
    } else if (date.isAfter(today.clone().subtract(6, "days"))) {
      return date.format("dddd"); // Returns weekday name (e.g., "Monday")
    } else {
      return date.format("DD/MM/YYYY"); // Formats as date (e.g., "01/01/2024")
    }
  }

  // date label function end

  parseMessage(message: string): string {
    if (!message) return "";

    // Convert URLs to clickable links
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    message = message.replace(
      urlPattern,
      (url) => `<a href="${url}" target="_blank">${url}</a>`
    );

    // Replace line breaks with <br> tags
    message = message.replace(/\n/g, "<br>");

    // Add support for bold and italic formatting (e.g., *bold* and _italic_)
    message = message
      .replace(/\*(.*?)\*/g, "<b>$1</b>") // *text* -> bold
      .replace(/_(.*?)_/g, "<i>$1</i>"); // _text_ -> italic

    return message;
  }

  messageData: any = {};
  messageDataArray: any = [];
  mediaArray: any = [];

  onChatMessageSelect(event: any, messageObj: any, contactDetails: any) {
    let checked = event?.checked;
    if (!checked) {
      let findedIndex = this.messageDataArray?.findIndex(
        (md: any) => md?.message_id === messageObj?.message_id
      );

      if (findedIndex !== -1) {
        this.messageDataArray.splice(findedIndex, 1);
      }

      let findedIndexForMedia = this.mediaArray?.findIndex(
        (md: any) => md?.message_id === messageObj?.message_id
      );

      if (findedIndexForMedia !== -1) {
        this.mediaArray.splice(findedIndexForMedia, 1);
      }
    } else {
      let newObj: any = {};
      newObj = {
        message_id: messageObj?.message_id,
        message_type: messageObj?.message_type,
        media: messageObj?.media,
        body: messageObj?.body,
        sender_name: contactDetails,
        from_me: messageObj?.from_me,
        timestamp: messageObj?.timestamp,
        mediaArray: messageObj?.mediaArray,
      };

      if (messageObj?.message_type !== "chat") {
        if (messageObj?.media) {
          let newMedia = messageObj["mediaArray"][0];
          (newMedia["message_id"] = messageObj?.message_id),
            (newMedia["timestamp"] = messageObj?.timestamp),
            this.mediaArray.push(newMedia);
        }
      }

      this.messageDataArray.push(newObj);

      this.messageData = {
        attachments: cloneDeep(this.mediaArray),
        mainAttachments: cloneDeep(this.mediaArray),
        messageData: this.messageDataArray,
      };
    }
  }

  isActionMessageOverlayOpen = false;
  openOverlay() {
    this.isActionMessageOverlayOpen = true;
  }

  overlayClose(event: any) {
    if (event) {
      this.selectedProfile = null;
      this.chatsMessageParams.page = 1;
      this.chatsMessageParams.offset = 0;
      this.chatMessagesData = [];
      this.messageData = null;
      this.messageDataArray = [];
      this.mediaArray = [];
      this.isProfileSelected = false;
    }

    this.isActionMessageOverlayOpen = false;
  }

  rightSideFullReset() {
    this.selectedProfile = null;
    this.chatsMessageParams.page = 1;
    this.chatsMessageParams.offset = 0;
    this.chatMessagesData = [];
    this.messageData = null;
    this.messageDataArray = [];
    this.mediaArray = [];
    this.isProfileSelected = false;
  }

  leftSideFullReset() {
    this.chatsParams.page = 1;
    this.chatsParams.offset = 0;
    this.chatsData = [];
    this.freshChatsData = [];
    this.contactParams.page = 1;
    this.contactParams.offset = 0;
    this.contactData = [];
    this.freshContactData = [];
  }

  formatTimestamp(timestamp: number | string): string {
    const date = moment(timestamp);
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");

    if (date.isSame(today, "day")) {
      // return "Today";
      return date.format("h:mm A");
    } else if (date.isSame(yesterday, "day")) {
      return "Yesterday";
    } else if (date.isAfter(today.clone().subtract(6, "days"))) {
      return date.format("dddd"); // Returns weekday name (e.g., "Monday")
    } else {
      return date.format("DD/MM/YYYY"); // Formats as date (e.g., "01/01/2024")
    }
  }
}
