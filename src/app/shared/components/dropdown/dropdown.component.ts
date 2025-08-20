import { Component, Input, OnInit, ViewChild,EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/smvt-framework/services/common.service';
import { SharedService } from 'src/app/core/service/shared.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { BehaviorService } from 'src/app/core/service/behavior.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  hospitalSearch: string = "";
  Form: FormGroup;
  @Input() data: any;
  totalElementHospital: any;
  hospitalData: any[] = [];
  @ViewChild(MatSelect) select: MatSelect;
  allSelecteds = false;
  loading = false;
  offset = 0;
  limit = 30;
  totalHospital: any;
  page: number = 1;
  isLoader: boolean = false;
  
  @Output() selectedOptionsChange = new EventEmitter<string[]>();
  @Input() label: string;
  @Input() dropDownItems:any;
  @Input() validation: any;
  timeout = null;
  
  constructor(
    public svc: CommonService,
    private _sharedService: SharedService,
    private _behaviorService: BehaviorService
  ) { }

  ngOnInit(): void {}
  toggleAllSelection() {    
    const selectedOptions: any[] = [];
    if (this.allSelecteds) {
      this.dropDownItems = [];  
      this.isLoader = true;      
      this._sharedService.getCmsData("getAllHospital", {page: 1,limit: "",search: "",}).subscribe((res: any) => {
          this.dropDownItems = this.dropDownItems.concat(res.data?.content);
          this.page += 1;
          this.totalHospital = res.data?.totalElement;
          this.offset = this.dropDownItems.length;
          setTimeout(() => {
            this.select.options.forEach((item: MatOption) =>{
              item.select();
              selectedOptions.push(item.value);
            } );
            this.isLoader = false;
            this.selectedOptionsChange.emit(selectedOptions);
          }, 30);
      }); 
    } else {
      this.select.options.forEach((item: MatOption) => {
        item.deselect();
        this.selectedOptionsChange.emit(selectedOptions);
      } );
    }
  }
  
  optionClick() {
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
    this.selectedOptionsChange.emit(selectedOptions);
  }
  getHospital() {
    if (this.isLoader) return;
    this.isLoader = true;
    this._sharedService.getCmsData("getAllHospital", {page: this.page,limit: this.limit,search: "",}).subscribe((res: any) => {
      this.hospitalData = this.hospitalData.concat(res.data?.content);
      this.page += 1;
      this.totalHospital = res.data?.totalElement;
      this.offset = this.hospitalData.length;
      this.dropDownItems = this.hospitalData;
      this.isLoader = false;
    });
  }
  searchHospital(searchText:any) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
        this.dropDownItems = [];
        console.log(searchText);
        this.isLoader = true;
        this._sharedService.getCmsData("getAllHospital", {page: 1,limit: "",search: searchText,}).subscribe((res: any) => {
          this.dropDownItems = res.data?.content;
          this.page += 1;
          this.totalHospital = res.data?.totalElement;
          this.offset = this.dropDownItems.length;
          this.isLoader = false;
        });
    }, 600);
  }
}
