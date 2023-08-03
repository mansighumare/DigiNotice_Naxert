import { Component, OnInit, Input } from '@angular/core';
import { LandCategoryEnum, EditPropertyModel } from 'src/app/models/asset-manager';

declare var $;

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.scss']
})
export class ViewPropertyComponent implements OnInit {

  @Input() editPropertyModel: EditPropertyModel = null;

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