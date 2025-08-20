import { DialogConfig } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SMFormEventData, SMFormValueChangeData } from '../../interfaces/sm-framework-defaults';
import { CommonService } from '../../services/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericDialogBase } from '../../base-class/generic-dialog-base';
import { MatAccordion } from '@angular/material/expansion';
@Component({
  selector: "app-sm-form",
  templateUrl: "./sm-form.component.html",
  styleUrls: ["./sm-form.component.scss"],
})
export class SmFormComponent extends GenericDialogBase implements OnInit,OnChanges {
  isLightBox:boolean = false;
  checkedList: any[] = [];

  constructor(
    public svc: CommonService,
    public matRef:MatDialogRef<SmFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ){super(svc)}

  imgURL1:string = 'https://images.pexels.com/photos/15560669/pexels-photo-15560669.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load';
  imgURL2:string = 'https://images.pexels.com/photos/13919680/pexels-photo-13919680.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load';
  imgURL3:string = 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  imgURL4:string = 'assets/images/test.pdf'

  lightBoxData:any;
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
      url:this.imgURL4,
      caption:'test',
      type:'pdf',
    },
    {
      url:this.imgURL3,
      caption:'test',
      type:'video',
    },
    {
      url:this.imgURL3,
      caption:'test',
      type:'image',
    },
    
  ]

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input("formConfig") config: DialogConfig;
  @Input('data') data:any;
  @Input('radioData') radioData:any;

  @Output() valueChanges: EventEmitter<SMFormValueChangeData> = new EventEmitter()
  @Output() formEvent: EventEmitter<SMFormEventData> = new EventEmitter()
  @Output() formReady: EventEmitter<null> = new EventEmitter();
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();

  title!:string
  mode!:string
  form: FormGroup<{}>;
  fields: any[];
  ready:boolean = false;
  crudData : DialogConfig;
  arrayGroup: any;
  groupFields: any[];
  groupConfig:any[];

  demoArray = [
    {value:'VISHAL',text:'vishal fjdskaljfkdslaj'},
    {value:'PRATIK',text:'Pratik'},
    {value:'SACHIN',text:'Sachin fkdsal '},
    {value:'NITIN',text:'Liv Hospital Ankara (Ankara)'},
    {value:'JOHN DOE',text:'John Doe'},
    {value:'MIKE',text:'Mike'},
  ]

  ngOnChanges(changes: SimpleChanges): void {
    this.crudData = changes?.config?.currentValue[0];
    this.init();
  }
  ngOnInit(): void {
    if(this.crudData['data'] && this.crudData['mode'] === 'Edit') this.form.patchValue(this.crudData['data']);
    this.ready = true;
  };
  makeSubmitDisable(){
    return (
      this.radioData == "Download Proforma Invoice" ||
      this.radioData == "Download VIL" ||
      this.radioData == "Download Ticket Copy" 
    )
  }

  openLightBox($event:any,data:any[],i:number){
    this.lightBoxData = {data,i,$event}
    this.isLightBox = true;
  }
  closeLightBox({$event,eventType}){
    if(eventType == 'CLOSE') this.isLightBox = false
  }

  mcIsSelected({ name, value }: { name: string; value: any; }): boolean {
    let control = this.form.get(name)
    return control && control.value ? control.value.indexOf(value) >= 0 : false
  }
  mcToggle(field: any, value: any) {
    setTimeout(() => {
      let control = this.form.get(field)
      if (control) {
        let values: any[] = control.value || [], idx = values.indexOf(value)
        idx >= 0 ? values.splice(idx, 1) : values.push(value)
        control.patchValue(values)
      }
    })
  }

  onCheckboxChange(option:any, event:any) {
    if (event.checked) {
      this.checkedList.push(option.url);
    } else {
      for (var i = 0; i < this.checkedList.length; i++) {
        if (this.checkedList[i] == option.url) {
          this.checkedList.splice(i, 1);
        }
      }
    }
    // console.log(this.checkedList)
  };
  
  downloadDoc(){
    if(this.checkedList.length === 0){
      this.imageArray.forEach((val,i) => {
        let a = document.createElement('a');
        a.download = val.url;
        a.href = val.url;
        a.click();
      })
    }
  }
  private init(){
    this.fields = this.crudData['fields'];
    this.setupCrud();
    this.prepareFormGroup();
    this.setupFields();
  }
  private setupCrud() {
    if (this.crudData) {
      if(this.crudData['crudType'] !== 'page') this.matRef.updateSize(`${this.crudData['cols'] * 200}px`,`${this.crudData['rows'] * 110}px`);
      if(this.crudData['mode'] === 'Edit' || this.crudData['mode'] === 'Create') this.mode = this.crudData['mode'];
      this.title = this.crudData['title'].split(' ').filter((e: string) => e !== 'List').join(' ').toString();
    }
  }
  setupFields() {
    this.fields = this.fields.map((res: any) => {
      if(res.type == 'group') res.groupConfig = this.setupArrayFields(res.groupConfig)
      return {
        ...res,
        class: 'w-' + res.col + '-' + this.crudData['cols'],
      }
    })
  }
  prepareFormGroup(data?:any) {
    let group = {};
    this.fields.map((f) => {
      if(f.type !== 'group' && f.type !== 'button' && f.type !== 'label-only') group[f.name] = new FormControl({ value: null, disabled: f.disabled }, f.validators);
      if(f.type === 'group') group[f.name] = new FormArray([])
    });
    this.form = this.svc.formBuilder.group(group);
    this.svc.form.next(this.form);
  }
  setupArrayFields(data:any[]): any[]{
    return data.map((res: any) => {
      return {
        ...res,
        class: 'w-' + res.col + '-' + this.crudData['cols'],
        imageArray:[],
        filePreviewUrls:[]
      }
    });
  }
  makeArray(data: any[]): any {
    let group = {};
    data.map((f: any) => { group[f.name] = new FormControl({ value: null, disabled: f.disabled }, f.validators) })
    group = this.svc.formBuilder.group(group);
    return group
  }
  pushNewArray(name,data){
    let group = {};
    data.map((f:any) => {
      group[f.name] = new FormControl({ value: null, disabled: f.disabled }, f.validators);
    })
    group = this.svc.formBuilder.group(group);
    let control = this.form.get(name) as FormArray;
    return control.push(group); 
  }
  deleteArray(i:number,name:string){
    let control = this.form.get(name) as FormArray;
    control.removeAt(i)
  }
  setId(name:any,n,i){
    return `${name}-${n}${i}`
  }
  private getFieldConfig(name: string): any {
    return this.fields.find((field: any) => field.name == name)
  }
  getFormControl(name, type) {
    if (type === 'GROUP') return this.form.get(name) as FormControl;
    if (type === 'ARRAY') {
      let controls;
      let groupFields = this.fields.filter((f: any) => f.type === 'group');
      groupFields.forEach((val: any) => {
        let data
        let control = this.form.get(val.name)
        if (control instanceof FormArray) {
          for (const formControl of control.controls) {
            data = formControl.get(name) as FormControl
          }
        }
        if(data) controls = data
      })
      return controls
    }
  }
  errorMessage(name: string,type?:any) {
    let control:any = this.getFormControl(name,type);
    if (!control.touched) return
    let errors = control.errors;
    let field = this.getFieldConfig(name);
    let errorTypes = ['required','email','minlength','maxlength','min','max','pattern']
    if (errors) {
      for (let i = 0; i < errorTypes.length; i++) {
        let errorType = errorTypes[i]
        if (errors[errorType]) {
          if (field?.validationMessage) return field?.validationMessage()
          else {
            switch (Object.keys(errors)[0]) {
              case 'required': return 'Required'
              case 'email': return 'Invalid Email'
              case 'minlength': return 'Invalid min length'
              case 'maxlength': return 'Invalid max length'
              case 'maxlength': return 'Invalid max length'
              case 'min': return 'Invalid min value'
              case 'max': return 'Invalid max value'
              default:
                break;
            }
          }
        }
      }
    }
    return null
  }
  emitExpansionEvent({fieldName: fieldName, eventType: eventType, $event: $event }){
    this.emitFormEvent(fieldName,eventType,$event);
  }
  emitFormEvent(fieldName:any, eventType:any , $event:any){
    let data: SMFormEventData = { fieldName: fieldName, eventType: eventType, $event: $event }
    setTimeout(() => this.formEvent.emit(data))
  }
  clearColor(name: string, $event: any) {
    this.form.get(name)?.patchValue(null)
    this.emitFormEvent(name, 'clear', $event)
  }
  validation(){
    // console.log(this.form.getRawValue());
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity({emitEvent: false});
    this.svc.ui.flashError('Please complete the form before submitting','OK')
  }
  emitFormSubmit(){
    this.formSubmit.emit(this.form.getRawValue());
    if(this.form.invalid) this.validation();
    if(this.form.valid) this.submit(this.form)
  }
  isStdFormField(prop: any) {
    return (
      prop.type != "checkbox" &&
      prop.type != "label-only" &&
      prop.type != "button" &&
      prop.type != "radio"  &&
      prop.type != "date-time"
    );
  }
  dialogButtonConfig = [
    {name:'NO',color:'warn'},
    {name:'YES',color:'primary'}
  ]
  close() {
    if (!this.form.pristine) {
      return this.svc.ui.warnDialog('Sure you want to leave without saving changes ?', this.dialogButtonConfig, 4).subscribe((res: any) => {
        if (res.button.name === 'YES') this.matRef.close();
      })
    } else this.matRef.close();
  }

  // FILE UPLOADER METHODS START
  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  onFileSelected(event: any,fieldName:string) {
    let control:FormControl = this.form.get(fieldName) as FormControl
    for (let i = 0; i < event.target.files.length; i++) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
      const file = event.target.files[i];
      this.fileList.push(file)
      if (allowedExtensions.exec(file.name)) {
        if(file.type === 'application/pdf'){
          const fileUrl = URL.createObjectURL(file);
          this.filePreviewUrls.push(fileUrl);
        }else{
          const reader = new FileReader();
          reader.onload = () => {
            this.filePreviewUrls.push(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }else if(!allowedExtensions.exec(file.name)){
        this.svc.ui.flashError('Only JPG,JPEG,PDF,PNG File Type allowed','OK')
      }
    }
    control.setValue(this.fileList);
  }
  onDelete(file: File) {
    const index = this.fileList.indexOf(file);
    if (index !== -1) {
      this.fileList.splice(index, 1);
    }
  }

  groupFileUpload(imgArray: any[], previewArray, event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
      const file = event.target.files[i];
      imgArray.push(file)
      if (allowedExtensions.exec(file.name)) {
        if (file.type === 'application/pdf') {
          const fileUrl = URL.createObjectURL(file);
          previewArray.push(fileUrl);
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            previewArray.push(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      } else if (!allowedExtensions.exec(file.name)) {
        this.svc.ui.flashError('Only JPG,JPEG,PDF,PNG File Type allowed', 'OK')
      }
    }
  }

  getGroupArray(item,prop,i){
    // console.log(item,prop,i);
  }

  // FILE UPLOADER METHODS END





}