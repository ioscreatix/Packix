import {AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, ViewEncapsulation, TemplateRef} from '@angular/core';
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
import {ActivatedRoute} from "@angular/router";
import {QuillEditorComponent} from "ngx-quill";
import {PackageScreenshotApi} from "../../../shared/sdk/services/custom/PackageScreenshot";
import {PackageScreenshot} from "../../../shared/sdk/models/PackageScreenshot";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {RepositoryApi} from "../../../shared/sdk/services/custom/Repository";
import {PatreonReward} from "../../../shared/objects/PatreonReward";
import { CurrencyPipe } from '@angular/common';
import {PackageDownloadRestriction} from "../../../shared/sdk/models/PackageDownloadRestriction";
import {PackageDownloadRestrictionApi} from "../../../shared/sdk/services/custom/PackageDownloadRestriction";
import {PackagePurchaseApi} from "../../../shared/sdk/services/custom/PackagePurchase";
import {PackageGiftLinkApi} from "../../../shared/sdk/services/custom/PackageGiftLink";
import {AccountSelectComponent} from "../../../components/account-select/account-select.component";
import {PurchasesTableComponent} from "../../../components/purchases-table/purchases-table.component";
import {PackagePurchase} from "../../../shared/sdk/models/PackagePurchase";
import {ReviewsTableComponent} from "../../../components/reviews-table/reviews-table.component";
import {DeveloperPreferences, PackageVersionReview} from "../../../shared/sdk/models";
import {DeveloperPreferencesApi, PackageVersionReviewApi} from "../../../shared/sdk/services/custom";
import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'package-view',
    templateUrl: 'package-view.template.html'
})

export class PackageViewComponent implements AfterViewInit, OnDestroy{

  public package: Package;
  public packageID: string;
  public detailedPackageDescription: any;
  public screenshotUploader: FileUploader;
  public modalRef: BsModalRef;
  public possiblePatreonInfo: any;
  public selectedPatreonReward: PatreonReward;
  public patreonRewards: PatreonReward[] = [];
  public downloadRestrictions: PackageDownloadRestriction[] = [];
  public selectedRewardId: string;
  public patreonRestrictionId: string = null;
  public paypalRestrictionId: string = null;
  public paypalPaymentPrice: any = "0";
  public salesCount: any = 0;
  public salesAmount: any = 0;
  public salesFees: any = 0;
  public packageReviews: PackageVersionReview[] = [];
  private shouldShowPaid: boolean = false;
  public emailsString: string = "";
  public emailSepString: string = "";
  public packageName: string = "";
  public packageShort: string = "";
  public showPatreonRestriction: boolean = false;
  public showPayPalRestriction: boolean = false;
  public developerPrefs: DeveloperPreferences;
  public cydiaStoreRestrictionId: string;
  public cydiaStorePackageId: string = "";
  public showCydiaStoreRestriction: boolean = false;

  public purchaseColumns: any = [
    { prop: 'account', name: 'User' },
  ];

  public packagePurchases: any;

  @ViewChild(AccountSelectComponent) accountSelect: AccountSelectComponent;
  @ViewChild(PurchasesTableComponent) purchasesTable: PurchasesTableComponent;
  @ViewChild(ReviewsTableComponent) reviewsTable: ReviewsTableComponent;


  @ViewChild('editor') editor: QuillEditorComponent;

  constructor(
    private packageAPI: PackageApi,
    private auth: LoopBackAuth,
    private route: ActivatedRoute,
    private screenshotAPI: PackageScreenshotApi,
    private repositoryAPI: RepositoryApi,
    private packageRestrictionAPI: PackageDownloadRestrictionApi,
    private packagePurchaseAPI: PackagePurchaseApi,
    private modalService: BsModalService,
    private giftAccountAPI: PackageGiftLinkApi,
    private packageVersionReviewAPI: PackageVersionReviewApi,
    private toasterService: ToasterService,
    private developerPrefsApi: DeveloperPreferencesApi
  ) {

    this.screenshotUploader = new FileUploader({
      autoUpload: true,
      authToken: this.auth.getAccessTokenId(),
      url: LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Packages/screenshots/upload",
      isHTML5: true
    });

    this.screenshotUploader.onCompleteItem = this.screenshotUploadComplete;
    this.screenshotUploader['delegate'] = this;

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.packageID = params['id'];
        this.screenshotUploader.setOptions({
          url: LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Packages/" + this.packageID + "/screenshots/upload"
        });
        this.loadPackageData();
      }
    });

    RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

  loadPackageData() {

    this.developerPrefsApi.getSettings().subscribe((devSettings: DeveloperPreferences) => {
      this.developerPrefs = devSettings;
      this.showPatreonRestriction = this.developerPrefs.usePatreon;
      this.showPayPalRestriction = this.developerPrefs.usePaypal;
      this.showCydiaStoreRestriction = this.developerPrefs.useCydiaStore || false;
    });

    this.packagePurchaseAPI.count({
      packageId: this.packageID,
      status: 'Completed'
    }).subscribe((purchaseCount : any) => {
      console.log(purchaseCount);
      this.salesCount = purchaseCount.count;
      console.log(this.salesCount);
      if (this.package) {
        if (this.package.isPaid || this.salesCount > 0) this.shouldShowPaid = true;
        else this.shouldShowPaid = false;
      }
    });

    this.packageVersionReviewAPI.find({
      where: {
        packageId: this.packageID
      }
    }).subscribe((reviews: PackageVersionReview[]) => {
      this.packageReviews = reviews;
    });
    this.packageAPI.findById(this.packageID,{
      include: [
        {versions: 'file'},
        'latestVersion',
        'downloadRestrictions'
      ]
    })
      .subscribe((packageObject : Package) => {
        this.package = packageObject;
        this.packageName = this.package.name;
        this.packageShort = this.package.shortDescription;
        if (this.salesCount > 0 || this.package.isPaid === true) this.shouldShowPaid = true;
        else this.shouldShowPaid = false;
        this.detailedPackageDescription = this.package.detailedDescription;
        if (this.editor) {
          this.editor.writeValue(this.package.detailedDescription);
          console.log(this.editor);
        }

        this.downloadRestrictions = this.package.downloadRestrictions;
        console.log(this.package);

        this.selectedRewardId = '000000';
        this.patreonRestrictionId = null;
        this.paypalRestrictionId = null;
        this.paypalPaymentPrice = "0";
        for (let restriction of this.downloadRestrictions) {
          if (restriction.type === 'patreon') {
            this.selectedRewardId = restriction['data']['rewardId'];
            this.patreonRestrictionId = restriction.id;
            this.selectedPatreonReward = {
              id: restriction['data']['rewardId'],
              amount: restriction['data']['rewardAmount'],
              campaignId: restriction['data']['campaignId']
            }
          } else if (restriction.type === 'paypal-payment') {
            this.paypalRestrictionId = restriction.id;
            this.paypalPaymentPrice = restriction['data']['price'];
          } else if (restriction.type === 'cydia-store') {
            this.cydiaStoreRestrictionId = restriction.id;
            this.cydiaStorePackageId = restriction['data']['packageIdentifier'];
          }
        }

        this.repositoryAPI.getPatreonInfo().subscribe((rewards : PatreonReward[]) => {
          this.patreonRewards = rewards as Array<PatreonReward> ;
        });

        this.packagePurchaseAPI.find({
          where: {
            packageId: this.packageID,
            status: 'Completed'
          },
          include: ['account']
        }).subscribe((purchases : PackagePurchase[]) => {
          this.packagePurchases = purchases;
          this.salesAmount = 0;
          this.salesFees = 0;
          for (let purchase of this.packagePurchases) {
            this.salesFees += parseFloat(purchase.details.feeAmount);
            this.salesAmount += parseFloat(purchase.details.amount.value);
          }
          // other stuff here
        });
      });
  }

  ngAfterViewInit() {
    jQuery('body').addClass('app-packages');
  }

  screenshotUploadComplete(item:any, response:any, status:number, headers:any) {
    let packageData: Package = new Package(JSON.parse(response));

    console.log(packageData);
    console.log(this);
    console.log(item);

    let queue: Array<any> = item.uploader.queue;
    queue.splice( queue.indexOf(item), 1 );

    this['delegate'].package['screenshots'] = packageData.screenshots;
  }

  compareThings(ra: PatreonReward, rb: PatreonReward): boolean {
    return ra && rb ? ra.id === rb.id : false;
  }

  removeScreenshot(screenshot: any) {
    console.log(screenshot.id);
    console.log(this.screenshotAPI);
    this.screenshotAPI.deleteById(screenshot.id)
      .subscribe((thing: any) => {
        console.log(thing);
      });
    this.package['screenshots'].splice(  this.package['screenshots'].indexOf(screenshot), 1 );
  }


  savePackageDescription() {
    if (this.package) {
      this.package.detailedDescription = this.detailedPackageDescription;
      this.packageAPI.patchAttributes(this.package.id,{
        "detailedDescription": this.detailedPackageDescription
      })
        .subscribe((packageChanges : any) => {
          console.log(packageChanges);
        });
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  setPatreonReward(value: any) {
    if (value === '000000') {
      this.selectedPatreonReward = null;
      this.selectedRewardId = '000000';
    } else {
      for (let reward of this.patreonRewards) {
        if (reward.id === value) {
          this.selectedPatreonReward = reward;
          this.selectedRewardId = reward.id;
        }
      }
    }
    console.log(this.selectedPatreonReward);
  }

  savePatreonRestriction() {
    if (this.patreonRestrictionId && this.selectedRewardId != '000000') {
        this.packageRestrictionAPI.patchAttributes(this.patreonRestrictionId, {
          data: {
            campaignId: this.selectedPatreonReward.campaignId,
            rewardAmount: this.selectedPatreonReward.amount,
            rewardId: this.selectedPatreonReward.id
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
    } else {
      if (this.selectedRewardId && this.selectedRewardId != '000000') {
        this.packageRestrictionAPI.create({
          type: 'patreon',
          packageId: this.package.id,
          data: {
            campaignId: this.selectedPatreonReward.campaignId,
            rewardAmount: this.selectedPatreonReward.amount,
            rewardId: this.selectedPatreonReward.id
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      } else {
        if (this.patreonRestrictionId) {
          this.packageRestrictionAPI.deleteById(this.patreonRestrictionId).subscribe((thing: any) => {
            this.loadPackageData();
          });
        }
      }
    }
  }

  saveCydiaStoreRestriction() {
    if (this.cydiaStoreRestrictionId) {
      if (this.cydiaStorePackageId.length > 0) {
        this.packageRestrictionAPI.patchAttributes(this.cydiaStoreRestrictionId, {
          data: {
            packageIdentifier: "" + this.cydiaStorePackageId + ""
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      } else {
        this.packageRestrictionAPI.deleteById(this.cydiaStoreRestrictionId).subscribe((thing: any) => {
          this.loadPackageData();
        });
      }
    } else {
      if (this.cydiaStorePackageId.length > 0) {
        this.packageRestrictionAPI.create({
          type: 'cydia-store',
          packageId: this.package.id,
          data: {
            packageIdentifier: "" + this.cydiaStorePackageId + ""
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      }
    }
  }

  savePayPalRestriction() {
    if (this.paypalRestrictionId) {
      if (this.paypalPaymentPrice > 0) {
        this.packageRestrictionAPI.patchAttributes(this.paypalRestrictionId, {
          data: {
            price: "" + this.paypalPaymentPrice + ""
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      } else {
        this.packageRestrictionAPI.deleteById(this.paypalRestrictionId).subscribe((thing: any) => {
          this.loadPackageData();
        });
      }
    } else {
      if (this.paypalPaymentPrice > 0) {
        this.packageRestrictionAPI.create({
          type: 'paypal-payment',
          packageId: this.package.id,
          data: {
            price: "" + this.paypalPaymentPrice + ""
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      }
    }
  }

  saveRestrictions() {
    console.log(this.paypalPaymentPrice);
    this.savePayPalRestriction();
    this.savePatreonRestriction();
    this.saveCydiaStoreRestriction();
    this.toasterService.pop({
      type: 'success',
      title: 'Saved Successfully',
      body: 'The restrictions have been saved successfully',
      //toastContainerId: toastContainerId
    });
  }

  giftAccount() {
    this.toasterService.pop({
      type: 'success',
      title: 'Gifted Successfully',
      body: 'The package has been gifted Successfully',
      //toastContainerId: toastContainerId
    });

    let accountId = this.accountSelect.selectedAccount;
    if (accountId && accountId.length > 0) {
      this.giftAccountAPI.create({
        accountId: accountId,
        packageId: this.packageID
      }).subscribe((data: any) => {
        this.accountSelect.selectedAccount = null;
      });
    }
    console.log(this.accountSelect.selectedAccount);
  }

  public validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public giftToEmails() {
    let emailsString = this.emailsString;
    emailsString = emailsString.replace(/\s+/g,'X');
    let emails = emailsString.split(this.emailSepString);
    let validEmails = [];
    for (let email of emails) {
      if (this.validateEmail(email)) {
        validEmails.push(email);
      }
    }

    this.packageAPI.giftToEmails(this.packageID, validEmails).subscribe((result) => {
      console.log('Gifted to ' + validEmails.length + ' emails.');
      this.emailsString = "";
      this.emailSepString = "";
      this.toasterService.pop({
        type: 'success',
        title: 'Gifted Successfully',
        body: 'The package has been gifted successfully to ' + validEmails.length + ' emails',
      });
    })
  }


  public savePackage() {
    let updatedDict = {
      "name": this.packageName,
      "shortDescription": this.packageShort
    };

    this.packageAPI.patchAttributes(this.package.id, updatedDict).subscribe((data: any) => {
      if (data['name']) {
        this.toasterService.pop({
          type: 'success',
          title: 'Updated Successfully',
          body: 'The package details have been successfully updated',
        });
        this.loadPackageData();
      }
    })
  }

  ngOnDestroy() {
    jQuery('body').removeClass('app-packages');
  }
}
