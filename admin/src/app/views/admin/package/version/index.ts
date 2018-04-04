import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PackageVersionViewComponent } from "./package-version-view.component";
import {RemarkDirectivesModule} from "../../../../helpers/directives/index";
import {RouterModule} from "@angular/router";
import { ChartsModule } from 'ng2-charts-x';
// import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SortablejsModule} from "angular-sortablejs";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
      PackageVersionViewComponent
    ],
    imports: [
      BrowserModule,
      RemarkDirectivesModule,
      RouterModule,
      FormsModule,
      SortablejsModule,
      ChartsModule,
      NgxChartsModule,
      BrowserAnimationsModule
    ],
    exports: [
      PackageVersionViewComponent
    ]
})

export class PackageVersionViewModule {}
