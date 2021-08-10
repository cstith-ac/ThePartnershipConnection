import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PartnerCallToActionButton } from '../../models/partnercalltoactionbutton';
declare var $: any;

@Component({
  selector: 'app-calltoactionlisting',
  templateUrl: './calltoactionlisting.component.html',
  styleUrls: ['./calltoactionlisting.component.css']
})
export class CalltoactionlistingComponent implements OnInit {
  partnerCallToActionButton: PartnerCallToActionButton[];
  memo="Send a message to Alarm Connections regarding this account";
  callToActionListingMemoForm: FormGroup;
  emailAddress;
  customer_Id;

  constructor(
    public fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    public jwtHelper: JwtHelperService
  ) { }

  ngOnInit() {
    $("#wrapper").addClass("toggled");

    this.spinnerService.show();
    
    this.routeService.getPartnerCallToActionButton().subscribe(
      res => {
        if(res) {
          this.spinnerService.hide();
        }
        this.partnerCallToActionButton = res;

        // for(var i = 0; this.partnerCallToActionButton.length;i++) {
        //   console.log(this.partnerCallToActionButton[i].addressOnFile)
        // }
      }
    )

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.callToActionListingMemoForm = this.fb.group({
      EmailAddress: this.emailAddress = JSON.parse(localStorage.getItem('user')).email,
      NoteType: "Collections",
      Memo: "",
      ServiceTicketID: 1,
      CustomerID: "",
      IncentiveID: 1,
      CancelQueueID: 1,
      ProspectID: 1,
      CustomerSystemID: 1
    })
  }

  onOpenMemoModal(customer_Id:number) {
    $("#memoModal").modal("show");
    //console.log(customer_Id)
    this.customer_Id = customer_Id;
    this.callToActionListingMemoForm.controls["CustomerID"].setValue(this.customer_Id);
    //console.log(e.target)
  }

  onSubmitMemo(form: FormGroup) {
    console.log(this.callToActionListingMemoForm.value)
    this.routeService.postPartnerAddNote(this.callToActionListingMemoForm.value).subscribe(
      res => {
        console.log(res)
      },
      error => console.log('error: ', error)
    )
  }

}
