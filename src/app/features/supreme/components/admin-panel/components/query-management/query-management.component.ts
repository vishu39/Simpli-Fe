import { Component, OnInit } from '@angular/core';
import { fromEvent, map } from 'rxjs';
import { GenericCrudBase } from 'src/app/smvt-framework/base-class/generic-crud-base';
import { SMToolBar } from 'src/app/smvt-framework/interfaces/sm-framework-defaults';
import { CommonService } from 'src/app/smvt-framework/services/common.service';
import { QueryDialog } from './query-dialog/query-dialog.component';

@Component({
  selector: 'app-query-management',
  templateUrl: './query-management.component.html',
  styleUrls: ['./query-management.component.scss']
})
export class QueryManagementComponent extends GenericCrudBase implements OnInit {
  direction:boolean = true
  arrow:string
  constructor(public svc : CommonService) { 
    super(svc)
  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.lazyLoading()
    },500)
    // this.svc.data.get('patient').pipe(tap((res) => {
    //   // console.log(res);
    // })).subscribe()
  }
  toolbarConfig: SMToolBar = {
    title: "Query Management",  
    button: [
      { name: "Add Patient", icon: "add", color: "gray", mode: 'Create' },
      { name: "Filter", icon: "filter_list", color: "gray", mode:'Filter' },
      { name: "Refresh", icon: "refresh", color: "gray", mode: 'Refresh' },
    ],
    filterConfig:{
      cols:6,
      rows:6,
      fields:[
        {name:'name',label:"Name",type:'text'},
        {name:'role.roleName',label:"Role Name",type:'text'},
        {name:'gender',label:"Select Gender",type:'custom-list',list$:this.demoList.bind(this)}
      ]
    }
    
  }
  demoList(){ }
  private lazyLoading() {
    // const content = document.querySelector(".list-wrapper");
    // const scroll$ = fromEvent(content!, "scroll").pipe(map(() => content!.scrollTop));
    // scroll$.subscribe((scrollProp) => {
    //   let limit = content!.scrollHeight - content!.clientHeight;
    //   // console.log(scrollProp.toFixed() ," ", limit);
    // })

    // scroll$?.subscribe((scrollPos) => {
    //   let limit = content!.scrollHeight - content!.clientHeight;
    //   let scrollCount = Number(scrollPos.toFixed());
    //   // console.log(limit,"limit");
    //   // console.log(scrollCount,"scrollCount");
    //   if ((scrollCount >= limit || (scrollCount - 1) === limit) && !this.complete) {
    //     this.currentPage += 1;
    //     let e = Object.keys(this.sortedKeys)[0];
    //     forkJoin([
    //       this.items$.pipe(take(1)),
    //       this.svc.get("queries/list/"+this.id+"?page="+this.currentPage+"&page_size="+this.pageSize +"&order_by_field_list[]=" +e +"&order_by_direction_list[]=" +this.sortedKeys[e]),
    //     ]).subscribe((data: Array<Array<any>>|any) => {
    //       if (data[1]["data"]["length"] == 0) {
    //         this.complete = true
    //       }
    //       let newArray = data[0];
    //       newArray = newArray.concat(data[1]["data"]);
    //       this.requestDataList$.next(newArray);
    //     });
    //   }
    // });
  }
  dialogButtonConfig = [
    {name:'NO',color:'warn'},
    {name:'YES',color:'primary'}
  ]
  queryEventHandler(data:any){
    if(data.mode === 'Delete') {
      return this.svc.ui.warnDialog('Sure you want to delete ?', this.dialogButtonConfig, 4).subscribe((res) => {
        if(res.button.name === 'YES') this.svc.ui.flashSuccess('Delete Successful');
      })
    }
    let dialogData = {data,title:data.prop?.tooltip,dialogComponent:QueryDialog};
    this.svc.dialog.open(QueryDialog,{data:dialogData,enterAnimationDuration:'0ms',exitAnimationDuration:'0ms',backdropClass:'dialogBackdrop',panelClass:'custom-dialog',disableClose:true})
  }
}