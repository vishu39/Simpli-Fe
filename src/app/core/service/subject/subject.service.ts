import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SubjectService {
  constructor() {}

  followUpApiRecallSubject = new Subject();

  // subject for message communication
  messageCommunicationChangedSubjectForHospital = new BehaviorSubject({
    isChanged: false,
  });

  messageCommunicationChangedSubjectForFacilitator = new BehaviorSubject({
    isChanged: false,
  });
}
