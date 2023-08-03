import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LandCategoryEnum, EditPropertyModel, AddPropertyModel } from 'src/app/models/asset-manager';
declare var $;

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent implements OnInit {

  @Input() editPropertyModel: EditPropertyModel = null;
  @Input() propertyIndex: number = 0;
  @Input() isDropdownMenu: boolean = true;
  @Output() onDelete: EventEmitter<EditPropertyModel> = new EventEmitter();
  @Output() onEdit: EventEmitter<EditPropertyModel> = new EventEmitter();
  @Output() onView: EventEmitter<EditPropertyModel> = new EventEmitter();

  constructor() { }

  Plots: LandCategoryEnum = LandCategoryEnum.Plots;
  ConstructedProperty: LandCategoryEnum = LandCategoryEnum.ConstructedProperty;
  AgriculturalLand: LandCategoryEnum = LandCategoryEnum.AgriculturalLand;


  ngOnInit() {
  }

  onEditProperty(editPropertyModel: EditPropertyModel) {
    this.onEdit.emit(editPropertyModel);
  }

  onDeleteProperty(editPropertyModel: EditPropertyModel, propertyIndex: number) {
    editPropertyModel.propertyIndex = propertyIndex;
    this.onDelete.emit(editPropertyModel);
  }

  onViewProperty(editPropertyModel: EditPropertyModel) {
    this.onView.emit(editPropertyModel);
  }
}