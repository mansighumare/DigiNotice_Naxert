import { Component, OnInit } from '@angular/core';

declare var $;
@Component({
  selector: 'app-lookups',
  templateUrl: './lookups.component.html',
  styleUrls: ['./lookups.component.scss']
})
export class LookupsComponent implements OnInit {

  constructor() { }


  lookupTables: any = [
    { "name": "LuCountry", "title": "Countries" },
    { "name": "LuStates", "title": "States" },
  ];
  ngOnInit() {

  }

  tablesData: any = {
    "LuStates": {
      columns: [
        { "name": "stateId", "displayName": "State Id", "canEdit": false },
        { "name": "stateName", "displayName": "State Name", "canEdit": true },
        { "name": "countryId", "displayName": "Country Id", "canEdit": false }
      ],
      rows: [
        { "stateId": 1, "stateName": "Maharastra", "countryId": 1 },
        { "stateId": 2, "stateName": "Karnataka", "countryId": 1 },
        { "stateId": 3, "stateName": "California", "countryId": 2 },
        { "stateId": 4, "stateName": "Texas", "countryId": 2 },
      ]
    },
    "LuCountry": {
      columns: [
        { "name": "countryId", "displayName": "Country Id", "canEdit": false },
        { "name": "countryName", "displayName": "Country Name", "canEdit": true },
      ],
      rows: [
        { "countryId": 1, "countryName": "India" },
        { "countryId": 2, "countryName": "United States" },
      ],
    }
  };

  selectedTable: string = "";
  tableInfo: any = [];
  onTableChange($event) {
    this.selectedTable = $event.target.value;
    this.tableInfo = this.tablesData[this.selectedTable];

    var tblHead = null, tblBody = null, tblRow = null, rowCell = null
    var table = document.getElementById("tbl-rows");
    table.innerHTML = "";


    tblHead = document.createElement("THEAD");
    tblRow = document.createElement("TR");
    this.tableInfo.columns.forEach(column => {
      rowCell = document.createElement("TH");
      rowCell.innerHTML = column.displayName;
      tblRow.appendChild(rowCell);
    });
    this.addActionButtons(tblRow, true);
    tblHead.appendChild(tblRow);

    tblBody = document.createElement("TBODY");
    this.tableInfo.rows.forEach(row => {
      tblRow = document.createElement("TR");
      this.tableInfo.columns.forEach(column => {
        rowCell = document.createElement("TD");
        rowCell.innerHTML = row[column.name];
        if (column.canEdit)
          rowCell.classList.add("editable");
        tblRow.appendChild(rowCell);
      });
      this.addActionButtons(tblRow);
      tblBody.appendChild(tblRow);
    });
    table.appendChild(tblHead);
    table.appendChild(tblBody);

    $("#tbl-rows").on("click", "td.edit-icon", function (e) {
      $(table).find("tr").removeClass("active");
      $(e.target).parents("tr").addClass("active");

      //Edit eitable td's in current tr
      $(e.target).parents("tr").find("td.editable").attr("contenteditable", true);
      //Edit all eitable td's
      // $(table).find("td.editable").attr("contenteditable", true);
    });

    $("#tbl-rows").on("click", "td.delete-icon", function (e) {
      $(e.target).parents("tr").remove();
    });
  }

  addActionButtons(tblRow, isHeader = false) {
    var canEdit = true;
    var canDelete = true;
    var rowCell = null;
    var tagName = isHeader ? "TH" : "TD";
    if (canEdit) {
      rowCell = document.createElement(tagName);
      // rowCell.innerHTML = "Edit";
      rowCell.innerHTML = '<img src="./assets/img/edit-icon.png" class="edit-icon" />';
      if (!isHeader)
        rowCell.classList.add("edit-icon");
      tblRow.appendChild(rowCell);
    }
    if (canDelete) {
      rowCell = document.createElement(tagName);
      // rowCell.innerHTML = "Delete";
      rowCell.innerHTML = '<img src="./assets/img/delete-icon.png" class="delete-icon" />';
      if (!isHeader)
        rowCell.classList.add("delete-icon");
      tblRow.appendChild(rowCell);
    }
  }

}
