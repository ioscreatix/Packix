import {AfterViewInit, Component, OnDestroy, Directive, ViewChild} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {PackageApi} from "../../../shared/sdk/services/custom/Package";
import {LoopBackAuth} from "../../../shared/sdk/services/core/auth.service";
import {LoopBackConfig} from "../../../shared/sdk/lb.config";
import {Account} from "../../../shared/sdk/models/Account";
import {PackageFile} from "../../../shared/sdk/models/PackageFile";
import {RemarkPlugin} from "../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../helpers/plugins/scrollable";
import {AccountGroupApi} from "../../../shared/sdk/services/custom/AccountGroup";
import {AccountGroup} from "../../../shared/sdk/models/AccountGroup";
import {ActivatedRoute} from "@angular/router";
import {AccountSelectComponent} from "../../../components/account-select/account-select.component";
import {AccountGroupLinkApi} from "../../../shared/sdk/services/custom/AccountGroupLink";
import {DeveloperPreferencesApi, RepositoryApi} from "../../../shared/sdk/services/custom";
import {DeveloperPreferences} from "../../../shared/sdk/models";
import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'developer-settings-view',
    templateUrl: 'settings-view.template.html'
})

export class SettingsViewComponent implements AfterViewInit, OnDestroy{

  public group: AccountGroup;
  public groupId: string;
  public accounts: Account[] = [];
  public devSettings: DeveloperPreferences;

  @ViewChild(AccountSelectComponent) accountSelect: AccountSelectComponent;

  constructor(
    private packageAPI: PackageApi,
    private auth: LoopBackAuth,
    private groupsAPI: AccountGroupApi,
    private route: ActivatedRoute,
    private accountGroupLinkApi: AccountGroupLinkApi,
    private repositoryApi: RepositoryApi,
    private devSettingsApi: DeveloperPreferencesApi,
    private toasterService: ToasterService
  ) {
    this.loadSettingsData();
    // this.route.params.subscribe(params => {
    //   this.groupId = params['id'];
    //   console.log(this.groupId);
    //   this.loadGroupData();
    // });
  }

  loadSettingsData() {
    this.devSettingsApi.getSettings().subscribe((settings: DeveloperPreferences) => {
      this.devSettings = settings;
    });
  }

  saveSettingsData() {
    console.log(this.devSettings);
    let updatedSettings = this.devSettings;
    delete updatedSettings.id;
    delete updatedSettings.accountId;
    this.devSettingsApi.updateSettings(updatedSettings).subscribe((settings: DeveloperPreferences) => {
      this.devSettings = settings;
      this.toasterService.pop({
        type: 'success',
        title: 'Saved Successfully',
        body: 'The setting have been saved successfully',
        //toastContainerId: toastContainerId
      });
    })
  }

  addAccountToDevelopers() {

    let accountId = this.accountSelect.selectedAccount;
    if (accountId && accountId.length > 0) {
      this.repositoryApi.makeUserDeveloper(accountId).subscribe((data: any) => {
        console.log(data);
        this.accountSelect.selectedAccount = null;
        this.toasterService.pop({
          type: 'success',
          title: 'Success',
          body: 'The user has been successfully made a developer',
          //toastContainerId: toastContainerId
        });
      });
    }
    console.log(this.accountSelect.selectedAccount);
  }

  ngAfterViewInit() {
    // jQuery('body').addClass('page-aside-left');
    // jQuery('body').addClass('page-aside-scroll');
    jQuery('body').addClass('app-packages');
   // console.log("test reload");
  }

  ngOnDestroy() {
    jQuery('body').removeClass('app-packages');
  }
}
