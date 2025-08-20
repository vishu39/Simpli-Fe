import { CommonService } from "../services/common.service";
import { GenericCrudBase } from "./generic-crud-base";

export class GenericListBase extends GenericCrudBase {
    constructor(public svc:CommonService){
        super(svc)
    }
}