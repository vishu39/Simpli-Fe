import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-operation-dialog',
  templateUrl: './operation-dialog.component.html',
  styleUrls: ['./operation-dialog.component.scss']
})
export class OperationDialogComponent implements OnInit {
  isComments:boolean = true;
  currentDate = new Date();
  isReports:boolean = false;
  isPassport:boolean = false;
  isTickets:boolean = false;
  isLightBox:boolean = false;
  lightBoxData:any;
  uploadedFiles: File[] = [];

  foods: any[] = [
    {value: 'steak-0', viewValue: 'Vishal'},
    {value: 'pizza-1', viewValue: 'Sachin'},
    {value: 'tacos-2', viewValue: 'Nitin'},
  ];
  priority : any[] = [
    {value: 'P1', viewValue: 'P1',flag:'red'},
    {value: 'P2', viewValue: 'P2',flag:'orange' },
    {value: 'P3', viewValue: 'P3',flag:'blue' },
    {value: 'P4', viewValue: 'P4',flag:'#ccc'},
  ];
  reminder : any[] = [
    {value: 'HOUR', viewValue: 'Every Hour'},
    {value: 'THREE_HOUR', viewValue: 'Every 3 Hour'},
    {value: 'DAY', viewValue: 'Every Day',flag:'blue'},
    {value: 'TWO_DAY', viewValue: 'Every 2 Days a week'},
  ];

  imgURL1:string = 'https://images.pexels.com/photos/15560669/pexels-photo-15560669.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load';
  imgURL2:string = 'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load';
  imgURL3:string = 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  imgURL4:string = 'https://www.africau.edu/images/default/sample.pdf'
  imageArray = [
    {
      url:this.imgURL1,
      caption:'test',
      type:'image',
    },
    {
      url:this.imgURL2,
      caption:'test',
      type:'image',
    },
    {
      url:this.imgURL3,
      caption:'test',
      type:'image',
    },
    {
      url:this.imgURL2,
      caption:'test',
      type:'image',
    },
    {
      url:this.imgURL2,
      caption:'test',
      type:'image',
    },    {
      url:this.imgURL2,
      caption:'test',
      type:'image',
    },    {
      url:this.imgURL2,
      caption:'test',
      type:'image',
    },    {
      url:this.imgURL2,
      caption:'test',
      type:'image',
    },
  ]
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matRef: MatDialogRef<OperationDialogComponent>,
  ) { this.audioElement = new Audio();}

  ngOnInit(): void {
    // console.log(this.data);
  }
  close(){
    this.matRef.close()
  }

  mentions = ['@john', '@jane', '@mary', '@Hospital'];
  inputValue = '';
  filteredMentions = [];
  showDropdown = false;

  onInputChange(event: Event) {
    const inputText = (event.target as HTMLInputElement).value;
    const mentionText = inputText.substring(inputText.lastIndexOf('@') + 1);
    if(mentionText) {
      this.filteredMentions = this.mentions.filter(m => m.toLowerCase().includes(mentionText.toLowerCase()));
    }
    this.showDropdown = !!mentionText;
  }
  onMentionSelect(mention: string) {
    this.inputValue = this.inputValue.substring(0, this.inputValue.lastIndexOf('@')) + mention;
    this.showDropdown = false;
  }
  openLightBox($event:any,data:any[],i:number){
    this.lightBoxData = {data,i,$event}
    this.isLightBox = true;
  }
  closeLightBox({$event,eventType}){
    if(eventType == 'CLOSE') this.isLightBox = false
  }

  onFileChange(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.uploadedFiles.push(files[i]);
    }
  }

  deleteFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }
  isRecording = false;
  recordedAudio: string;
  audioList: string[] = [];

  mediaRecorder: MediaRecorder;
  recordedChunks: any[] = [];
  recordings: any[] = [];
  audioElement: HTMLAudioElement;

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.isRecording = true;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.addEventListener("dataavailable", (event: any) => {
          this.recordedChunks.push(event.data);
        });
        this.mediaRecorder.addEventListener("stop", () => {
          const recording = new Blob(this.recordedChunks, { type: 'audio/wav' });
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
  playRecording(recording: any) {
    const url = URL.createObjectURL(recording);
    this.audioElement.src = url;
    this.audioElement.play();
  }
  stopPlaying() {
    this.audioElement.pause();
  }
  deleteRecording(recording: any) {
    this.audioElement.pause();
    const index = this.recordings.indexOf(recording);
    if (index > -1) {
      this.recordings.splice(index, 1);
    }
  }
}
