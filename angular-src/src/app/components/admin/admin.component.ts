import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { AspNetUsers } from '../../models/aspnetusers';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ASPNetPermissions } from 'src/app/models/aspnetpermissions';
import { AspnetPermissionsMap } from 'src/app/models/aspnetpermissionsmap';
declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  allUsers: AspNetUsers[];
  aspNetPermissions: ASPNetPermissions[];
  aspNetPermissionsMap: AspnetPermissionsMap[];
  deleteCurrentUserForm: FormGroup;
  id;
  userName;
  permissionsUserMap;
  clicked = false;//disables button after click

  constructor(
    public routeService: RouteService,
    public permissionService: PermissionsService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.routeService.getAllUsers().subscribe(
      res => {
        this.allUsers = res;
      }
    ) 

    this.deleteCurrentUserForm = this.fb.group({
      deleteCurrentUser: ["",Validators.required]
    })
  }

  editCurrentUser(id:number) {
    this.router.navigate(['admin-edit/'+ id])
  }

  editCurrentUserSettings(e, id:number, userName:string) {
    console.log(id)
    console.log(userName)
    this.id = id;
    this.userName = userName;
    // console.log(e)
    $("#settingsModal").modal("show");

    this.permissionService.getASPNetPermissions().subscribe(
      res => {
        console.log(res);
        this.aspNetPermissions = res;
      }
    )

    this.permissionService.getASPNetPermissionsMap().subscribe(
      res => {
        console.log(res);
        this.aspNetPermissionsMap=res;
      }
    )

    // populate the modal 
    // include y or n values from hasPermission
    this.permissionService.getPermissionsUserMap(userName).subscribe(
      res => {
        this.permissionsUserMap = res;
      }
    )
  }

  deleteCurrentUserModal(e, id: number) {
    $("#deleteUserModal").modal("show");
    this.id=id;
    console.log(id)
    console.log(e)
  }

  onChangeAccessFor3GConv(e) {
    e.target.innerHTML = e;
    // console.log(e.currentTarget.checked)
    // console.log(e.currentTarget.value)
    console.log(e.currentTarget)
    if(e.currentTarget.checked) {
      let permissionNameVal = e.currentTarget.value;
      //console.log(permissionNameVal + ' value is true')
      let permissionObj = {
        userName : this.userName,
        permissionID: 0,
        permissionName: permissionNameVal
      }
      //parameters are UserName, PermissionID, and PermissionName
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(!e.currentTarget.checked) {
      let permissionNameVal = e.currentTarget.value;
      //console.log(permissionNameVal + ' value is false')
      let permissionObj = {
        userName : this.userName,
        permissionID: 0,
        permissionName: permissionNameVal
      }
      //parameters are UserName, PermissionID, and PermissionName
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAbleToExport3G(e) {
    console.log(e.currentTarget.checked)
  }

  onChangeAccessForPendingCancel(e) {
    console.log(e.currentTarget.checked)
  }

  onChangeAccessToAgingCard(e) {
    console.log(e.currentTarget.checked)
  }

  onChangeAccessToAgingCallToAction(e) {
    console.log(e.currentTarget.checked)
  }

  onChangeAccessToInvIncentive(e) {
    console.log(e.currentTarget.checked)
  }

  onChangeAbleToCreateInvoice(e) {
    console.log(e.currentTarget.checked)
  }

  onChangeAccessToServiceCard(e) {
    console.log(e.currentTarget.checked)
  }

  onChangeAccessToSalesCard(e) {
    console.log(e.currentTarget.checked)
  }

  onChangeAccessToAttritionCard(e) {
    console.log(e.currentTarget.checked)
  }

  onSaveSettings() {
    console.log('onSaveSettings was called');
  }

  onSaveDeleteUser(id:number) {
    console.log(this.id);
  }

}
