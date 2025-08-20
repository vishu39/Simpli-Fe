import { CommonService } from "../services/common.service";
import { GenericCrudBase } from "./generic-crud-base";

export class GenericServiceBase extends GenericCrudBase {
    constructor(public svc:CommonService){
        super(svc)
    }
}