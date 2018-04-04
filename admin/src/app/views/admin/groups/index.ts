import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { GroupsViewComponent } from "./groups-view.component";
import {RemarkDirectivesModule} from "../../../helpers/directives/index";
import {RouterModule} from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from "ngx-bootstrap";
import {AccountSelectModule} from "../../../components/account-select/index";

@NgModule({
    declarations: [GroupsViewComponent],
    imports     : [BrowserModule, RemarkDirectivesModule, RouterModule, ModalModule, FormsModule, AccountSelectModule],
    exports     : [GroupsViewComponent]
})

export class GroupsViewModule {}
