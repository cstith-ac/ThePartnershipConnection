import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { AspNetUsers } from '../../models/aspnetusers';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ASPNetPermissions } from 'src/app/models/aspnetpermissions';
import { AspnetPermissionsMap } from 'src/app/models/aspnetpermissionsmap';
import { PermissionsUserMap } from 'src/app/models/permissionsusermap';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @ViewChild("permissionToggle") permissionToggle: ElementRef;

  allUsers: AspNetUsers[];
  aspNetPermissions: ASPNetPermissions[];
  aspNetPermissionsMap: AspnetPermissionsMap[];
  //permissionsUserMap: PermissionsUserMap[];
  deleteCurrentUserForm: FormGroup;
  permissionForm: FormGroup;
  id;
  userName;
  isChecked:boolean;
  permissionsUserMap=[];
  clicked = false;//disables button after click
  selected1: boolean = false;
  selected2: boolean = false;
  selected3: boolean = false;
  selected4: boolean = false;
  selected5: boolean = false;
  selected6: boolean = false;
  selected7: boolean = false;
  selected8: boolean = false;
  selected9: boolean = false;
  selected10: boolean = false;
  is3gConversion;
  isPendingCancellations;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public routeService: RouteService,
    public permissionService: PermissionsService,
    public jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    $("#wrapper").addClass("toggled");

    this.routeService.getAllUsers().subscribe(
      res => {
        this.allUsers = res;
      }
    ) 

    this.permissionForm = this.fb.group({
      HasPermission: FormControl
    })

    this.deleteCurrentUserForm = this.fb.group({
      deleteCurrentUser: ["",Validators.required]
    })
  }

  editCurrentUser(id:number) {
    this.router.navigate(['admin-edit/'+ id])
  }

  editCurrentUserSettings(e, id:number, userName:string) {
    // console.log(id)
    // console.log(userName)
   
    this.id = id;
    this.userName = userName;
    // console.log(e)
    $("#settingsModal").modal("show");

    this.permissionService.getASPNetPermissions().subscribe(
      res => {
        // console.log(res);
        this.aspNetPermissions = res;
      }
    )

    this.permissionService.getASPNetPermissionsMap().subscribe(
      res => {
        // console.log(res);
        this.aspNetPermissionsMap = res;
      }
    )

    // populate the modal 
    // include y or n values from hasPermission
    this.permissionService.getPermissionsUserMap(userName).subscribe(
      res => {
        this.permissionsUserMap = res;
        
        //console.log(this.permissionsUserMap)
        
        for(let i = 0; i < this.permissionsUserMap.length;i++) {

          if(this.permissionsUserMap[0].hasPermission === 'Y') {
            this.selected1 = true
          }
          if(this.permissionsUserMap[0].hasPermission === 'N') {
            this.selected1 = false
          }

          if(this.permissionsUserMap[1].hasPermission === 'Y') {
            this.selected2 = true
          }
          if(this.permissionsUserMap[1].hasPermission === 'N') {
            this.selected2 = false
          }

          if(this.permissionsUserMap[2].hasPermission === 'Y') {
            this.selected3 = true
          }
          if(this.permissionsUserMap[2].hasPermission === 'N') {
            this.selected3 = false
          }

          if(this.permissionsUserMap[3].hasPermission === 'Y') {
            this.selected4 = true
          }
          if(this.permissionsUserMap[3].hasPermission === 'N') {
            this.selected4 = false
          }

          if(this.permissionsUserMap[4].hasPermission === 'Y') {
            this.selected5 = true
          }
          if(this.permissionsUserMap[4].hasPermission === 'N') {
            this.selected5 = false
          }
          
          if(this.permissionsUserMap[5].hasPermission === 'Y') {
            this.selected6 = true
          }
          if(this.permissionsUserMap[5].hasPermission === 'N') {
            this.selected6 = false
          }

          if(this.permissionsUserMap[6].hasPermission === 'Y') {
            this.selected7 = true
          }
          if(this.permissionsUserMap[6].hasPermission === 'N') {
            this.selected7 = false
          }

          if(this.permissionsUserMap[7].hasPermission === 'Y') {
            this.selected8 = true
          }
          if(this.permissionsUserMap[7].hasPermission === 'N') {
            this.selected8 = false
          }

          if(this.permissionsUserMap[8].hasPermission === 'Y') {
            this.selected9 = true
          }
          if(this.permissionsUserMap[8].hasPermission === 'N') {
            this.selected9 = false
          }

          if(this.permissionsUserMap[9].hasPermission === 'Y') {
            this.selected10 = true
          }
          if(this.permissionsUserMap[9].hasPermission === 'N') {
            this.selected10 = false
          }
        }
      } 
    )
  }

  deleteCurrentUserModal(e, id: number) {
    $("#deleteUserModal").modal("show");
    this.id = id;
    console.log(id)
    console.log(e)
  }

  onChangePermission(e,i) {
    e.target.innerHTML = e;
    // console.log(e.currentTarget.checked)
    // console.log(e.currentTarget.value)
    console.log(e.currentTarget.value, i)
    if(e.currentTarget.checked) {
      let permissionNameVal = e.currentTarget.value;
      //console.log(permissionNameVal + ' value is true')
      let permissionObj = {
        userName : this.userName,
        permissionID: 0,
        permissionName: permissionNameVal
      }
      //return
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
      //return
      //parameters are UserName, PermissionID, and PermissionName
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAccessFor3GConv(e) {
    console.log(e.currentTarget.checked)
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

    $("#settingsModal").modal("hide");
    location.reload();
  }

  onSaveDeleteUser(id:number) {
    console.log(this.id);
  }

}
