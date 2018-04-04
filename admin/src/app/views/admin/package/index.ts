import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PackageViewComponent } from "./package-view.component";
import {RemarkDirectivesModule} from "../../../helpers/directives/index";
import {RouterModule} from "@angular/router";
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PackageVersionViewModule} from "./version/index";
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { ModalModule } from "ngx-bootstrap";
import {PatreonRewardSelectComponent} from "../../../shared/components/patreon-reward-select.component";
import {SharedComponentsModule} from "../../../shared/components/index";
import {AccountSelectModule} from "../../../components/account-select/index";
import {PurchasesTableModule} from "../../../components/purchases-table/index";
import {ReviewsTableModule} from "../../../components/reviews-table";
import {ToasterModule} from 'angular2-toaster';

@NgModule({
    declarations: [
      PackageViewComponent
    ],
    imports: [
      BrowserModule,
      RemarkDirectivesModule,
      RouterModule,
      FileUploadModule,
      QuillModule,
      FormsModule,
      PackageVersionViewModule,
      ModalModule,
      SharedComponentsModule,
      AccountSelectModule,
      PurchasesTableModule,
      ReviewsTableModule,
      ToasterModule.forChild()
    ],
    exports: [
      PackageViewComponent
    ]
})

export class PackageViewModule {}
