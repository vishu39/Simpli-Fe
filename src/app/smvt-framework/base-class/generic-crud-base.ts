// * ONLY FOR VISHAL WAKPAIJAN PLEASE DO NOT MADE ANY CHANGES IN THIS FILE //

import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "../services/common.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { SMCrudConfig, SMListEventData, SMToolBar, SMToolbarEventData } from "../interfaces/sm-framework-defaults";
import { SmCrudListComponent } from "../sm-crud/sm-crud-list/sm-crud-list.component";
import { SmToolbarComponent } from "../sm-crud/sm-toolbar/sm-toolbar.component";
import { SelectionModel } from "@angular/cdk/collections";
import { tap } from "rxjs";
import { MatSort, Sort } from '@angular/material/sort';
import { GenericFilterDialogComponent } from "../components/generic-filter-dialog/generic-filter-dialog.component";

@Component({
    selector:'',
    template:``,
})

export class GenericCrudBase implements OnInit, AfterViewInit {
  constructor(public svc:CommonService){};
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  standardCol:any[];
  columns:any[] = [];
  tableColumn:any[] = [];
  displayedColumns:any[];
  dataSource:any[] = [];
  length:number = 0;
  URL:string = '';
  private pageIndex:number; 
  private pageSize:number;
  isSearch:boolean = true;

  ngOnInit(): void {
  };
  
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      const url = `${this.URL}?page=${this.pageIndex + 1}&limit=${this.pageSize}&search=`;
      this.svc.data.get(url).pipe(
        tap((res: any) => {
          if (res) {
            this.dataSource = res.data.content;
            this.length = res.data.totalElement;
          }
        })
      ).subscribe();
    }
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) this.svc._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    else this.svc._liveAnnouncer.announce('Sorting cleared');
  }
  initList(config:SMCrudConfig){
    this.URL = config.getApi;
    this.standardCol = config.fields.filter(f => f.type === 'S');
    this.tableColumn = config.fields.map((n) => n.name);
    this.columns = this.getColumnData(this.standardCol);
    this.displayedColumns = this.columns.map((res:any) => res.columnDef);
  }
  getColumnData(val: any) {
    let colData: any = [];
    val.forEach((col) => {colData.push({
        columnDef: col.name,
        header: col.heading,
        cell: (row: any) => this.columnData(row, col),
        sort: col.sort
      },)
    })
    return colData
  }
  columnData(row:any, column:any) {
    let data = column.name.split('.').reduce((r, c) => r && (r[c] || r[c] === false || r[c] === 0) ? r[c] : null , row)
    return data
  }
  paginationHandler(e: PageEvent) {
    this.svc.data.get(this.URL + `?page=${e.pageIndex + 1}&limit=${e.pageSize}&search=`)
      .pipe(tap((res) => {
        this.dataSource = res.data.content;
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
      })).subscribe()
  }
  refresh(){
    this.getApi(this.pageIndex + 1,this.pageSize,'')
  }
  checkInput(e: any) {
    e.target.value ? this.isSearch = false : this.isSearch = true;
    let char = String.fromCharCode(e.which);
    if ((/[!@#$%^&*(),.?":{}|<>]/.test(char))) e.preventDefault();
  }
  create(component,data){
    if(data.mode === 'Create') {
      this.svc.dialog.open(component,{data:data})
    }
  }
  editDialog(component: any, event: SMListEventData) {
    if(event.mode === 'Edit') {
      this.svc.dialog.open(component,{data:event});
    }
  }
  submit(data){
    let rowData = data.getRawValue();
    // console.log( rowData ,'SUBMITTED');
    
    // this.svc.data.post(this.URL,rowData).pipe(tap((res:any) => {
    //   // console.log(res);
    // }))
  }
  toolbar(event: SMToolbarEventData, list: SmCrudListComponent, component?:any,toolbar?:SMToolBar) {
    switch (event.mode) {
      case 'Refresh':
        return this.refresh();
      case 'Create':
        return this.create(component, event);
      case 'Filter':
        return this.filterDialog(event,list,toolbar);
      case 'SEARCH':
        return this.search(event,list,toolbar);
      default:
        break;
    }
  }
  search(event?: SMToolbarEventData, list?: SmCrudListComponent, toolbar?: SMToolBar) {
    let val = event.$event?.target?.value || event.value
    if (event.eventType === 'ENTER' && val) {
      this.getApi('','',val);
    }else if((val === null || val === undefined) && event.eventType === 'INPUT'){
      this.refresh()
    }
  }
  getApi(pageIndex,pageSize,search){
    this.svc.data.get(this.URL + `?page=${pageIndex}&limit=${pageSize}&search=${search}`).subscribe((res: any) => {
      this.dataSource = res.data.content;
    })
  }
  validateInput(e) {
    let char = String.fromCharCode(e.which);
    if ((/[!@#$%^&*(),.?":{}|<>]/.test(char))) e.preventDefault();
  } 
  filterDialog(event?: SMToolbarEventData, list?: SmCrudListComponent,toolbar?: SMToolBar) {
    let filterData = {event:event,list:list,toolbar:toolbar}
    this.svc.dialog.open(GenericFilterDialogComponent,{data:filterData})
  }
  list(event:SMListEventData,toolbar:SmToolbarComponent,component){
    switch (event.mode) {
      case 'Edit':
        event.mode = 'Edit'
        return this.editDialog(component,event);
      case 'Delete':
        return // console.log("DELETE");
      default:
        break;
    }
  }
  editHandler(row: any,$event: any,toolbar: SmToolbarComponent,SampleDialogComponent?:any){
    let data : SMListEventData = {mode:'Edit',$event:$event,data:row};
    this.list(data,toolbar,SampleDialogComponent)
  }
  del(e){
    // // console.log(e._id);
    // this.svc.data.delete(this.URL)
  }

  // MAT-SELECT FUNCTION
  selection = new SelectionModel<any>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource);
  }
  checkboxLabel(row?:any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}