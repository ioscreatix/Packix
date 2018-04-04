import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {PackageApi} from "../../../shared/sdk/services/custom/Package";
import {LoopBackAuth} from "../../../shared/sdk/services/core/auth.service";
import {LoopBackConfig} from "../../../shared/sdk/lb.config";
import {Package} from "../../../shared/sdk/models/Package";
import {PackageFile} from "../../../shared/sdk/models/PackageFile";
import {RemarkPlugin} from "../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../helpers/plugins/scrollable";
import {AccountGroupApi} from "../../../shared/sdk/services/custom/AccountGroup";
import {AccountGroup} from "../../../shared/sdk/models/AccountGroup";

@Component({
    selector: 'groups-view',
    templateUrl: 'groups-view.template.html'
})

export class GroupsViewComponent implements AfterViewInit, OnDestroy{

  public packageUploader:FileUploader;
  public groups: AccountGroup[];

  constructor(
    private packageAPI: PackageApi,
    private auth: LoopBackAuth,
    private groupsAPI: AccountGroupApi
  ) {
      // this.packageUploader = new FileUploader({
      //   autoUpload: true,
      //   authToken: this.auth.getAccessTokenId(),
      //   url: LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Packages/upload",
      //   isHTML5: true
      // });
      //
      // this.packageUploader.onBuildItemForm = this.onBuildItemForm;
      // this.packageUploader.onCompleteItem = this.onCompleteItem;

      RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

  // onBuildItemForm(item: any, form: any) {
  //   form.append('packageId', '35kj32hj3h324kjh234');
  // }
  //
  // onCompleteItem(item:any, response:any, status:number, headers:any):any {
  //   let packageData:Package = new Package(JSON.parse(response));
  //  // packageData.versions = new PackageFile(packageData.file);
  //   item["packageData"] = packageData;
  //   console.log(item);
  // }

  loadGroupsData() {
    this.groupsAPI.find({
    }).subscribe((groups: AccountGroup[]) => {
      this.groups = groups;
    });
  }

  ngAfterViewInit() {
    // jQuery('body').addClass('page-aside-left');
    // jQuery('body').addClass('page-aside-scroll');
    jQuery('body').addClass('app-packages');
    this.loadGroupsData();
   // console.log("test reload");
   //  this.packageAPI.find({
   //  })
   //    .subscribe((packages : Package[]) => {
   //      this.packages = packages;
   //      console.log(this.packages);
   //    });
  }

  // onUploadError(event: any) {
  //     console.log('onUploadError:', event);
  //   }
  //
  //   onUploadSuccess(event: any) {
  //     console.log('onUploadSuccess:', event);
  //   }

    ngOnDestroy() {
      jQuery('body').removeClass('app-packages');
      // jQuery('body').removeClass('page-aside-scroll');
      // jQuery('body').removeClass('page-aside-left');
    }
}
