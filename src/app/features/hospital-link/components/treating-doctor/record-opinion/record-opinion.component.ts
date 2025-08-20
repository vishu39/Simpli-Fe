import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-record-opinion-open-link",
  templateUrl: "./record-opinion.component.html",
  styleUrls: ["./record-opinion.component.scss"],
})
export class RecordOpinionComponent implements OnInit {
  dialogTitle: string;
  recorderData = [];
  patientData: any;
  requestData: any;

  opinionForm: FormGroup;

  opinionData: any;

  constructor(
    private dialogRef: MatDialogRef<RecordOpinionComponent>,
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {
    this.audioElement = new Audio();
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  ngOnInit(): void {
    this.buildForm();
    this.onClickHospital(this.requestData);
  }

  buildForm() {
    this.opinionForm = this.fb.group({
      hospitalName: [
        {
          value: "",
          disabled: true,
        },
        [Validators.required],
      ],
      hospitalId: ["", [Validators.required]],
      doctorName: ["", [Validators.required]],
      doctorId: ["", [Validators.required]],
    });
  }

  onClickHospital(item: any) {
    this.opinionForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
      doctorName: item?.doctorName,
      doctorId: item?.doctorId,
    });
  }

  isRecording = false;
  recordedAudio: string;
  audioList: string[] = [];

  mediaRecorder: MediaRecorder;
  recordedChunks: any[] = [];
  recordings: any[] = [];
  audioElement: HTMLAudioElement;

  startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.isRecording = true;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.addEventListener("dataavailable", (event: any) => {
          this.recordedChunks.push(event.data);
        });
        this.mediaRecorder.addEventListener("stop", () => {
          const recording = new Blob(this.recordedChunks, {
            type: "audio/mp3",
          });

          let file = new File([recording], `rec-${Date.now()}.mp3`, {
            type: recording.type,
          });
          this.recorderData.push(file);
          this.recordings.push(recording);
          this.recordedChunks = [];
        });
        this.mediaRecorder.start();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  isRecordingPlaying: any = [];
  playRecording(index: any) {
    this.isRecordingPlaying[index] = true;
    const url = URL.createObjectURL(this.recordings[index]);
    this.audioElement.src = url;
    this.audioElement.play();

    this.audioElement.addEventListener("ended", () => {
      this.isRecordingPlaying[index] = false;
    });
  }
  stopPlaying() {
    this.isRecordingPlaying = [];
    this.audioElement.pause();
  }
  deleteRecording(recording: any) {
    this.audioElement.pause();
    const index = this.recorderData.indexOf(recording);
    if (index > -1) {
      this.recorderData.splice(index, 1);
      this.recordings.splice(index, 1);
    }
  }

  submit() {
    if (this.opinionForm.valid) {
      let values = this.opinionForm.value;
      values["hospitalName"] = this.requestData.hospitalName;
      let formData = new FormData();

      for (const key in values) {
        formData.append(key, values[key]);
      }

      formData.append("patient", this.patientData?._id);

      for (var i = 0; i < this.recorderData?.length; i++) {
        formData.append("fileFirst", this.recorderData[i]);
      }

      this.hospitalService
        .addRecordingByDoctorOpenLink(formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.closeDialog(true);
        });
    } else {
      this.opinionForm.markAllAsTouched();
    }
  }
}
