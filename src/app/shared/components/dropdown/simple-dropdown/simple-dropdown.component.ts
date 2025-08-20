import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-simple-dropdown',
  templateUrl: './simple-dropdown.component.html',
  styleUrls: ['./simple-dropdown.component.scss']
})
export class SimpleDropdownComponent implements OnInit {

  hospitalSearch: string = "";
  @Output() selectedOptionsChange = new EventEmitter<string[]>();
  @Output() Scroling = new EventEmitter<any[]>();
  @Output() onChange = new EventEmitter<any[]>();
  @Output() onSearch = new EventEmitter<any[]>();
  @Input() label: string;
  @Input() dropDownItems:any;
  @Input() validation: any;
  @Input() Offset : any;
  @Input() total: any;
  @Input() valueType: any;
  @Input() is_Loader: Boolean ;
  @Input() Default_Value: any ;
  timeout = null;

  selectedItem: any;
  
  constructor() { }

  ngOnInit(): void {
    if(this.Default_Value)
    this.selectedItem = this.Default_Value._id;
  }
  // getHospital(isPagination: boolean = true) {
  //   this._sharedService
  //     .getCmsData("getAllHospital", {
  //       page: this.hospitalPage,
  //       limit: this.hospitalLimit,
  //       search: "",
  //     })
  //     .subscribe((res: any) => {
  //       this.hospitalData = this.hospitalData.concat(res.data?.content);
  //       this.hospitalPage += 1;
  //       this.totalHospital = res.data?.totalElement;
  //       this.hospitalOffset = this.hospitalData.length;
  //       if (!isPagination) {
  //         this.selectedHospital = this.hospitalData[0];
  //         this.getAllHospitalEmailZone(this.hospitalData[0]._id);
  //       }
  //       for (let index = 0; index < this.hospitalData.length; index++) {
  //         const element = this.hospitalData[index];
  //         this.hospitalDataMap.set(element._id, element);
  //       }
  //     });
  // }
  ScrollFunction(){
    console.log('inn');
    this.Scroling.emit();
  }
  ChangeFunction(selected_id:any){
    console.log("selected_id",selected_id);
    this.onChange.emit(selected_id);
  }
  searchFunction(searchText:any) {
    this.is_Loader = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.onSearch.emit(searchText);
      this.is_Loader = false;
    }, 600);
  }
  optionClick(id:any) {
    this.onChange.emit(id);
  }
  getOptionValue(option:any){
    if(this.valueType == 'id'){
      return option._id;
    }else{
      return option.name;
    }
  }

  onSelectionChange(event: any) {
    this.selectedItem = event.value;
  }
}
