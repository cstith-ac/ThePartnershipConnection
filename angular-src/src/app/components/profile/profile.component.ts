import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/models/userprofile';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:any=Object;
  userProfile: UserProfile[];
  updateProfileForm: FormGroup;
  email: '';
  firstName: '';
  lastName: '';
  phoneNumber: '';
  cellPhoneNumber1: '';
  altEmail: '';
  u: "";
  closeResult = '';
  currentUserSettings: string;
  afaUserSettings = [
    {
      id: 19,
      userTier: "Super Admin",
      availablePermissions: ["Manage Admin"]
    },
    {
      id: 14,
      userTier: "Admin",
      availablePermissions: ["Manage Employee", "Shadow Employee"]
    },
    {
      id: 9,
      userTier: "Employee",
      availablePermissions: ["Manage Partner","Customer Care View", "Service View", "Collections View"]
    },
    {
      id: 5,
      userTier: "Partner",
      availablePermissions: ["Manage Customer User", "Manage Partner (same base)", "Update Partner Contact Info", "View Aging (Base)", "View Cancels (Base)", "View Service Tickets (Base)", "Create Service Tickets (Base)", "View Incentives (Base)", "Create Incentives (Base)", "View 3G List (Base)"]
    },
    {
      id: 1,
      userTier: "Customer",
      availablePermissions: ["Manage Customer User (same customer)", "View Invoice (account)", "View Service Tickets (account)", "Create Service Tickets (account)", "Pay Invoice (account)", "Update Contact Info (Account)"]
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    public fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.updateProfileForm = this.fb.group({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      cellPhoneNumber1: "",
      altEmail: ""
    })

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        this.userProfile = res;
      },
      err => {
        console.log(err);
      }
    )

    // if(this.authService.isTestUser) {
    //   this.router.navigate(['/forbidden'])
    //   debugger
    // }
  }

  get f() {
    return this.updateProfileForm.controls;
  }

  onSubmit(form: FormGroup) {
    console.log('Email: ', form.value.email)
    console.log('First name: ', form.value.firstName)
    console.log('Last name: ', form.value.lastName)
    console.log('Phone number: ', form.value.phoneNumber)
    console.log('Cell: ', form.value.cellPhoneNumber1)
    console.log('Alt email: ', form.value.altEmail)
  }

  editUser(id:number) {
    this.router.navigate(['profile-edit/'+ id])
  }

  // openSettingsModal() {
  //   console.log('open settings modal')
  // }

  openSettingsModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    //if the user role is super admin, then display the permissions for a super admin
    if(this.user.afaRole === 19) {
      this.afaUserSettings.forEach(function (value) {
        if(value.id === 19) {
          //console.log(value.availablePermissions[0])
          for(var i = 0; i < value.availablePermissions.length; i++) {
            console.log(i);
          }
          //this.currentUserSettings = value.availablePermissions;
        }
      })
      //this.currentUserSettings = this.afaUserSettings[0].availablePermissions.values()
    }
    //if the user role is admin, then display the permissions for a admin
    //if the user role is employee, then display the permissions for a employee
    //if the user role is partner, then display the permissions for a partner
    //if the user role is customer, then display the permissions for a customer
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
