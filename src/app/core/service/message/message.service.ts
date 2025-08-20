import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { InterceptorSkipHeader } from "../../interceptor/custom.interceptor";
import { SharedService } from "../shared/shared.service";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  periscopeBaseUrl: string = environment.periscopeBaseUrl;

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  getAllChats(data: any, xPhone: string, authToken: any) {
    let newXPhone = xPhone?.split("+")?.[1];
    let authorization = this.sharedService.decrypt(authToken);

    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, "")
      .set("Authorization", `Bearer ${authorization}`)
      .set("x-phone", `${newXPhone}`);

    let offset = (data?.page - 1) * data?.limit;

    return this.http.get(`${this.periscopeBaseUrl}/chats`, {
      headers,
      params: {
        offset: offset,
        limit: data?.limit,
        // chat_type: data?.chat_type,
        // label: data?.label,
      },
    });
  }

  getAllChatsMessagesByChatId(
    id: any,
    params: any,
    xPhone: string,
    authToken: any
  ) {
    let newXPhone = xPhone?.split("+")?.[1];
    let authorization = this.sharedService.decrypt(authToken);
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, "")
      .set("Authorization", `Bearer ${authorization}`)
      .set("x-phone", `${newXPhone}`);

    let offset = (params?.page - 1) * params?.limit;

    return this.http.get(`${this.periscopeBaseUrl}/chats/${id}/messages`, {
      headers,
      params: {
        offset: offset,
        limit: params?.limit,
      },
    });
  }

  getAllContact(data: any, xPhone: string, authToken: any) {
    let newXPhone = xPhone?.split("+")?.[1];
    let authorization = this.sharedService.decrypt(authToken);
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, "")
      .set("Authorization", `Bearer ${authorization}`)
      .set("x-phone", `${newXPhone}`);

    let offset = (data?.page - 1) * data?.limit;

    return this.http.get(`${this.periscopeBaseUrl}/contacts`, {
      headers,
      params: {
        offset: offset,
        limit: data?.limit,
      },
    });
  }
}
