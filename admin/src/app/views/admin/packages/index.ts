import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PackagesViewComponent } from "./packages-view.component";
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import {RemarkDirectivesModule} from "../../../helpers/directives/index";
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [PackagesViewComponent],
    imports     : [BrowserModule, FileUploadModule, RemarkDirectivesModule, RouterModule],
    exports     : [PackagesViewComponent]
})

export class PackagesViewModule {}
