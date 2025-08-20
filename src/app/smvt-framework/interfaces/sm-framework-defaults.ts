import { Observable } from "rxjs";
import type { EChartsOption } from 'echarts';
export interface SMFormTextField {
  type: 'text' | 'textarea' | 'number' | 'color' | 'password' | "email"
  name: string
  col?: number
  placeholder?:string
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  prefixText?: string
  suffixText?:string
  suffixIcon?:string
  iconPrefix?:string
  hidden?: boolean
  hint?:string
  validationMessage?: (_: string, __: any) => string
  width?: string
  inputPattern?: RegExp
}

export interface SMFormLabelOnlyField {
  type: 'label-only'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  hidden?: boolean
  width?: string
}

export interface SMFormDateTimeField {
  type: 'date-time'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  hidden?: boolean
  validationMessage?: (_: string, __: any) => string
  dateFormat?: string
  pickerType?: 'both' | 'calendar' | 'timer'
  min?: any
  max?: any
  width?: string
}

export interface SMFormDateField {
  type: 'date'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  hidden?: boolean
  validationMessage?: (_: string, __: any) => string
  timeFormat?: number
  width?: string
}

export interface SMFormTimeField {
  type: 'time'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  hidden?: boolean
  validationMessage?: (_: string, __: any) => string
  timeFormat?: number
  width?: string
}

export interface SMFormCheckboxField {
  type: 'checkbox'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  checkedValues?: string[]
  unCheckedValues?: string[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  validationMessage?: (_: string, __: any) => string
  hidden?: boolean
  width?: string
}

export interface SMFormRadioField {
  type: 'radio'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  validators?: any[]
  validationMessage?: (_: string, __: any) => string
  hidden?: boolean
  hint?:string
  width?: string
  values?: string[],
  clv?: string
  list$?: ((data: any) => Observable<{ value: any, text: string }[]>)
}
export interface SMFormCLVListField {
  type: 'clv-list'
  name: string
  clv: string
  multiple?: boolean
  col?: number
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  validationMessage?: (_: string, __: any) => string
  hidden?: boolean
  width?: string,
}

export interface SMFormCustomListField {
  type: 'custom-list'
  name: string
  multiple?: boolean
  col?: number
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  validationMessage?: (_: string, __: any) => string
  list$: ((data: any) => Observable<{ value: any, text: string }[]>)
  hidden?: boolean
  width?: string
}
export interface SMFormMultiCheckField {
  type: 'multi-checkbox'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  validationMessage?: (_: string, __: any) => string
  list$: (data: any) => Observable<any[]>
  hidden?: boolean
}

export interface SMFormAutoCompleteListField {
  type: 'auto-complete-list'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  validationMessage?: (_: string, __: any) => string
  list$: (data: any) => Observable<any[]>
  hidden?: boolean
  width?: string
}
export interface SMFormChipListField {
  type: 'chip-list'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  validationMessage?: (_: string, __: any) => string
  list$: (data: any) => Observable<any[]>
  hidden?: boolean
}
export interface SMFormChipsField {
  type: 'chips'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  validators?: any[]
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  validationMessage?: (_: string, __: any) => string
  hidden?: boolean
}

export interface SMButtonField {
  type: 'button'
  name: string
  color?: 'basic' | 'primary' | 'accent' | 'warn'
  col?: number
  startNewRow?: boolean
  label?: string
  disabled?:boolean
  hidden?: boolean
  width?: string
}
export interface SbFormFileField {
  type: 'files'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  optional?: boolean
  disabled?: boolean
  editable?: boolean
  multiple?: boolean
  validators?: any[]
  validationMessage?: (_: string, __: any) => string
  hidden?: boolean
}

export interface SMFormGroupField {
  type: 'group'
  name: string
  col?: number
  startNewRow?: boolean
  label?: string
  optional?: boolean
  groupConfig:any[]
  btnColor:string
  btnName:string
}

export interface SMFormExpansionField {
  type: 'expansion'
  name: string
  col?: number
  label?: string
  startNewRow?: boolean
  list$: (data: any) => Observable<any[]>
  validators?: any[]
  expansionType:'radio'|'checkbox'|'none'
  edit?:boolean
  headerFields?: 'OPINION'|'OPD'
}

export interface SMFormLightboxField {
  type: 'lightbox'
  name: string
  col?: number
  label?: string
  startNewRow?: boolean
  list$: (data: any) => Observable<any[]>
  validators?: any[]
}

export interface DialogFormConfig {
    api: string | ((_: any) => string)
    mode?: string
    title?:string
    cols: 1 | 2 | 3 | 4 | 6 ,
    rows?: 1 | 2 | 3 | 4 | 6 | 5 | 7 | 8,
    data?: any | ((_: any) => any),
    crudType: 'page' | 'dialog' 
    fields: Array<
    SMFormTextField |
    SMFormCheckboxField |
    SMFormCLVListField |
    SMFormCustomListField |
    SMFormMultiCheckField |
    SMFormAutoCompleteListField |
    SMFormDateTimeField |
    SMFormDateField |
    SMFormTimeField |
    SMFormChipListField |
    SMFormChipsField |
    SMFormLabelOnlyField |
    SMFormTimeField |
    SMButtonField |
    SMFormRadioField |
    SMFormGroupField | 
    SbFormFileField | 
    SMFormExpansionField | 
    SMFormLightboxField>
}

export interface SMFormValueChangeData {
  value: any
}
export interface SMFormEventData {
  fieldName: string
  eventType: string
  $event: any
}
export interface SMToolbarEventData {
  eventType: string
  $event: any
  mode:string
  title?:string
  value?:string
  data?:any
}

export interface SMListEventData {
  mode:string
  $event: any
  data:any
}

export interface SMFormListRowAdditional {
  [key: string]: string;
}
export interface SMFormListRow {
  value: any;
  text: string;
  additional?: SMFormListRowAdditional;
  additionalText?: string;
  data?: any;
}
export interface toolbarButton {
  name:string,
  icon:string,
  color:string,
  width?:string,
  height?:string,
  mode?:string,
  buttonType?:string
} 

export interface SMFilter {
  cols: 1 | 2 | 3 | 4 | 6 ,
  rows?: 1 | 2 | 3 | 4 | 6 | 5 | 7 | 8,
  fields: Array<
  SMFormTextField |
  SMFormCustomListField |
  SMFormDateTimeField |
  SMFormDateField |
  SMFormTimeField>;
}
export interface SMToolBar {
  title:string,
  button:toolbarButton[],
  filterConfig:SMFilter
}

export interface SMCrudFieldsConfig {
  type:'C'|'S'
  name:string
  heading?:string
  data?:((data: any) => Observable<any[]>)
  format?:string
  path?:string
  sort?:boolean
}
export interface SMCrudConfig {
  module?:string
  getApi:string
  fields:SMCrudFieldsConfig[]
}

export interface SMBarChart {
  chartName:string,
  chartStyle?:any,
  chartData:EChartsOption
  type?: any,
}