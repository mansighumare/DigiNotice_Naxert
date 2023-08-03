import { Component, Input, OnInit } from '@angular/core';
import { EditOrgPropertyModel, LandCategoryEnum } from 'src/app/models/org-asset-manager';
declare var $;
@Component({
  selector: 'app-view-org-asset',
  templateUrl: './view-org-asset.component.html',
  styleUrls: ['./view-org-asset.component.scss']
})
export class ViewOrgAssetComponent implements OnInit {
  @Input() editOrgPropertyModel: EditOrgPropertyModel = null;

  constructor() { }

  Plots: LandCategoryEnum = LandCategoryEnum.Plots;
  ConstructedProperty: LandCategoryEnum = LandCategoryEnum.ConstructedProperty;
  AgriculturalLand: LandCategoryEnum = LandCategoryEnum.AgriculturalLand;

  ngOnInit() {
  }

  closeViewPropertyPopup() {
    $("#view-property-popup").modal("hide");
  }

}
