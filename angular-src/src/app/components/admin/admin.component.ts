import { Component, OnInit, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AspNetUsers } from '../../models/aspnetusers';
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
  // @ViewChild("inputs") inputs:ElementRef;
  @ViewChild("inputs") inputs:ElementRef;

  allUsers: AspNetUsers[];
  aspNetPermissions: ASPNetPermissions[];
  aspNetPermissionsMap: AspnetPermissionsMap[];
  //permissionsUserMap: PermissionsUserMap[];
  deleteCurrentUserForm: FormGroup;
  permissionForm: FormGroup;
  adminUserSearchForm: FormGroup;

  searchTerm: string;

  collectionSize: number;

  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  pageSize=10;
  public value=5;
  
  id;
  userName;
  isChecked:boolean;
  permissionsUserMap=[];
  clicked = false;//disables button after click
  // selected1: boolean = false;
  selected1: number = 0;
  selected2: number = 0;
  selected3: number = 0;
  selected4: number = 0;
  selected5: number = 0;
  selected6: number = 0;
  selected7: number = 0;
  selected8: number = 0;
  selected9: number = 0;
  selected10: number = 0;
  removeSplash: boolean = true;
  // selected2: boolean = false;
  // selected3: boolean = false;
  // selected4: boolean = false;
  // selected5: boolean = false;
  // selected6: boolean = false;
  // selected7: boolean = false;
  // selected8: boolean = false;
  // selected9: boolean = false;
  // selected10: boolean = false;
  is3gConversion;
  isPendingCancellations;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public routeService: RouteService,
    public permissionService: PermissionsService,
    public jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService,
    private el: ElementRef
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

        //ES6 version
        this.allUsers.sort((a, b) => a.firstName.localeCompare(b.firstName))

        // this.allUsers.sort(function(a,b) {
        //   if(a.firstName < b.firstName) { return -1; }
        //   if(a.firstName > b.firstName) { return 1; }
        //   return 0;
        // })
      }
    ) 

    this.permissionForm = this.fb.group({
      HasPermission: ['Yes']
    })

    this.deleteCurrentUserForm = this.fb.group({
      deleteCurrentUser: ["",Validators.required]
    })

    this.adminUserSearchForm = this.fb.group({
      SearchTerm: [""]
    })
  }

  editCurrentUser(id:number) {
    // console.log('edit the user ', id);
    this.router.navigate(['admin-edit-user/'+ id]);
  }

  editCurrentUserPassword(id:number) {
    this.router.navigate(['admin-edit/'+ id]);
  }

  editCurrentUserPermissions(e, id:number, userName:string) {
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
            this.selected1 = 1
          }
          if(this.permissionsUserMap[0].hasPermission === 'N') {
            this.selected1 = 0
          }

          if(this.permissionsUserMap[1].hasPermission === 'Y') {
            this.selected2 = 1
          }
          if(this.permissionsUserMap[1].hasPermission === 'N') {
            this.selected2 = 0
          }

          if(this.permissionsUserMap[2].hasPermission === 'Y') {
            this.selected3 = 1
          }
          if(this.permissionsUserMap[2].hasPermission === 'N') {
            this.selected3 = 0
          }

          if(this.permissionsUserMap[3].hasPermission === 'Y') {
            this.selected4 = 1
          }
          if(this.permissionsUserMap[3].hasPermission === 'N') {
            this.selected4 = 0
          }

          if(this.permissionsUserMap[4].hasPermission === 'Y') {
            this.selected5 = 1
          }
          if(this.permissionsUserMap[4].hasPermission === 'N') {
            this.selected5 = 0
          }
          
          if(this.permissionsUserMap[5].hasPermission === 'Y') {
            this.selected6 = 1
          }
          if(this.permissionsUserMap[5].hasPermission === 'N') {
            this.selected6 = 0
          }

          if(this.permissionsUserMap[6].hasPermission === 'Y') {
            this.selected7 = 1
          }
          if(this.permissionsUserMap[6].hasPermission === 'N') {
            this.selected7 = 0
          }

          if(this.permissionsUserMap[7].hasPermission === 'Y') {
            this.selected8 = 1
          }
          if(this.permissionsUserMap[7].hasPermission === 'N') {
            this.selected8 = 0
          }

          if(this.permissionsUserMap[8].hasPermission === 'Y') {
            this.selected9 = 1
          }
          if(this.permissionsUserMap[8].hasPermission === 'N') {
            this.selected9 = 0
          }

          if(this.permissionsUserMap[9].hasPermission === 'Y') {
            this.selected10 = 1
          }
          if(this.permissionsUserMap[9].hasPermission === 'N') {
            this.selected10 = 0
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

  toggle(e) {
    console.log(e.target)
  }

  onChangePermission(e,i) {
    e.target.innerHTML = e;
    // console.log(e.currentTarget.checked)
    // console.log(e.currentTarget.value)
    console.log(e.currentTarget.value, i)
    if(e.currentTarget.value === 'N') {
      let permissionIDVal = i+1;
      //console.log(permissionNameVal + ' value is true')
      let permissionObj = {
        userName : this.userName,
        permissionID: permissionIDVal,
        permissionName: ''
      }
      this.inputs.nativeElement.classList.remove('noPermission')
      this.inputs.nativeElement.classList.add('slider')
      // console.log(permissionObj)
      // document.getElementById("myElement").classList.add('slider')
      // document.getElementById("myElement").classList.remove('noPermission')
      this.permissionForm.controls['HasPermission'].setValue('Y')
      //remove noPermission class, add slider class
      // let myTag = this.el.nativeElement.querySelector('span');
      // console.log(myTag)
      // myTag.classList.remove('noPermission')
      // myTag.classList.add('slider');
      // $(".foo").addClass("slider");
      // $(".foo").removeClass("noPermission");

      return
      //parameters are UserName, PermissionID, and PermissionName
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.value === 'Y') {
      let permissionIDVal = i+1;
      //console.log(permissionNameVal + ' value is false')
      let permissionObj = {
        userName : this.userName,
        permissionID: permissionIDVal,
        permissionName: ''
      }
      console.log(permissionObj)
      return
      //parameters are UserName, PermissionID, and PermissionName
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAccessFor3GConv(e) {
    //console.log(e.currentTarget.checked)
    // if(this.selected1 === 1) {
    //   console.log('delete')
    // }
    // if(this.selected1 === 0) {
    //   console.log('add')
    // }
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAccessForPendingCancel(e) {
    //console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAccessToAgingCard(e) {
    //console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAccessToAgingCallToAction(e) {
    //console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAccessToInvIncentive(e) {
    //console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAccessToServiceCard(e) {
    //console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAccessToSalesCard(e) {
    //console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAccessToAttritionCard(e) {
    //console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAbleToExport3G(e) {
    //console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeAbleToCreateInvoice(e) {
    //console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      console.log('add')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionAdd(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
    if(e.currentTarget.checked === false) {
      console.log('delete')
      console.log(e.target.value)
      let id=e.target.value;
      let permissionObj = {
        userName : this.userName,
        permissionID: parseInt(id),
        permissionName: ''
      }
      console.log(permissionObj)
      this.permissionService.postPermissionDelete(permissionObj).subscribe(
        res => {
          console.log(res)
        }
      )
    }
  }

  onChangeShowInstructions(e) {
    // console.log(e.target.value)
    // console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      //Show instructions? Yes
      console.log(e.currentTarget.checked)
      console.log('show instructions or value 0')
      this.removeSplash = true
    }
    if(e.currentTarget.checked === false) {
      //Show instructions? No
      console.log(e.currentTarget.checked)
      console.log('don\'t show instructions or value 1')
      this.removeSplash = false
    }
  }

  onSaveSettings() {
    console.log('onSaveSettings was called');

    $("#settingsModal").modal("hide");
    //location.reload();
  }

  onSaveDeleteUser(id:number) {
    console.log(this.id);
    //return
    this.routeService.deleteUser(id).subscribe(
      res => {
        console.log(res);
      }
    )
    $("#deleteUserModal").modal("hide");
  }

  search(value: string): void {
    this.allUsers = this.allUsers.filter((val) => 
    val.userName.toLowerCase().includes(value));
    this.collectionSize = this.allUsers.length;

    // this.adminUserSearchForm.valueChanges.subscribe(
    //   res => {
    //     console.log(res)
    //   }
    // )
  }

  onChangeClearSearch(e){
    console.log(e.target.value)
    this.adminUserSearchForm.valueChanges.subscribe(
      res => {
        console.log(res)
      }
    )
  }

  clearSearch() {
    console.log('clearSearch');
    this.routeService.getAllUsers().subscribe(
      res => {
        this.allUsers = res;
        this.searchTerm = ''

        //ES6 version
        this.allUsers.sort((a, b) => a.firstName.localeCompare(b.firstName))

        // this.allUsers.sort(function(a,b) {
        //   if(a.firstName < b.firstName) { return -1; }
        //   if(a.firstName > b.firstName) { return 1; }
        //   return 0;
        // })
      }
    )
    // this.results = [];

  }

  exportToExcel() {
    console.log('coming soon')
  }
}
