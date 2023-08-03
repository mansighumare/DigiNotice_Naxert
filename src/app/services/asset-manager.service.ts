import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AddPropertyModel } from 'src/app/models';

import { AppConfig } from '../services/config.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EditPropertyModel } from 'src/app/models/asset-manager';
import { AddOrgPropertyModel } from '../models/org-asset-manager';

@Injectable({
  providedIn: 'root'
})
export class AssetManagerService {

  constructor(
    private authService: AuthenticationService,
    public appConfig: AppConfig,
    public http: HttpClient) {

  }
  uploadPropertyImgUrl: string = this.appConfig.getImageUploadUrl("property");
  userId: string = this.authService.loggedInUser.userId;

  getProperties(userId: string) {
    // var searchModel = { userId: this.authService.loggedInUser.userId };
    // var url = this.appConfig.getApiPath("Property", "GetProperty", [this.userId]);
    var url = this.appConfig.getApiPath("Property", "GetProperty", [userId]);
    return this.http.get(url);
  }

  addProperty(addPropertyModel: AddPropertyModel) {
    var url = this.appConfig.getApiPath("Property", "AddProperty");
    return this.http.post(url, addPropertyModel);
  }

  addOrgProperty(addOrgPropertyModel: AddOrgPropertyModel) {
    var url = this.appConfig.getApiPath("Property", "AddOrgProperty");
    return this.http.post(url, addOrgPropertyModel);
  }

  uploadAssestImage(assetImage: any) {
    const formData = new FormData();
    formData.append('image', assetImage);
    var url = this.uploadPropertyImgUrl;
    return this.http.post(url, formData);
  }

  updateProperty(editPropertyModel: EditPropertyModel) {
    var url = this.appConfig.getApiPath("Property", "UpdateProperty");
    return this.http.post(url, editPropertyModel);
  }

  // deleteProperty(editPropertyModel: EditPropertyModel) {
  //   var url = this.appConfig.getApiPath("Property", "DeleteProperty");
  //   const options = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json', }),
  //     body: editPropertyModel
  //   };
  //   return this.http.post(url, options);
  // }


  deleteProperty(id: any) {
    var url = this.appConfig.getApiPath("Property", "DeleteProperty", [id]);
    return this.http.post(url, id);
  }
}
