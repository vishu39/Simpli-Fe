import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent implements OnInit {

  hospitalSearch: string = "";
  @ViewChild(MatSelect) select: MatSelect;
  @Output() selectedOptionsChange = new EventEmitter<{ type: any, selectedOptions: string[] }>();
  @Output() Scroling = new EventEmitter<any[]>();
  @Output() onChange = new EventEmitter<any[]>();
  @Output() onSearch = new EventEmitter<any[]>();
  @Output() onSelectAll = new EventEmitter<any[]>();
  @Output() onBlur = new EventEmitter<any[]>();
  @Input() label: string;
  @Input() dropDownItems:any;
  @Input() validation: any;
  @Input() Offset : any;
  @Input() total: any;
  @Input() valueType: any;
  @Input() is_Loader: Boolean ;
  @Input() Default_Value: any ;
  @Input() dropdownType;
  @Input() isRequired:any
  selectedOptions: any[] = [];
  timeout = null;
  allSelecteds = false;

  selectedItem: any;
  
  constructor() { }

  ngOnInit(): void {
  }
  BlurFunction(type:any){
    this.onBlur.emit(type);
  }
  ScrollFunction(type:any){  
    console.log('type',type);
    this.Scroling.emit(type);
  }
  ChangeFunction(selected_id:any){
    console.log("selected_id",selected_id);
    this.onChange.emit(selected_id);
  }
  searchFunction(searchText:any) {
    // this.is_Loader   = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    this.onSearch.emit(searchText);
      // this.is_Loader = false;
    }, 600);
  }
  optionClick(id:any) {

    this.onChange.emit(id);
    const selectedOptions: any[] = [];
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }else{
        selectedOptions.push(item.value);
      }
    });
    this.allSelecteds = newStatus;    
    this.selectedOptionsChange.emit({ type: this.dropdownType, selectedOptions: selectedOptions });
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
  toggleAllSelection(){
    const selectedOptions: any[] = [];
    if (this.allSelecteds) {
      this.onSelectAll.emit(this.dropdownType);
    } else {
      this.select.options.forEach((item: MatOption) => {
        item.deselect();
      } );
      this.selectedOptionsChange.emit({ type: this.dropdownType, selectedOptions: selectedOptions });
    }
  }
  receviedStatus(){
    const selectedOptions: any[] = [];
    this.select.options.forEach((item: MatOption) =>{
      item.select();
      selectedOptions.push(item.value);
    } );
    this.selectedOptionsChange.emit({ type: this.dropdownType, selectedOptions: selectedOptions });
    setTimeout(() => {
      this.is_Loader = false
    }, 3000);
  }
}
