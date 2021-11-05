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
import { FlashMessagesService } from 'angular2-flash-messages';
import { HttpErrorResponse } from '@angular/common/http';

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
    public jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    $("#wrapper").addClass("toggled");

    this.spinnerService.show();
    
    this.routeService.getPartnerCallToActionButton().subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
          this.flashMessage.show('Your requested data is displayed below', {
            cssClass: 'text-center alert-success',
            timeout: 5000
          });
        }
        
        console.log(res)
        console.log(res.body)
        console.log(res.headers)
        console.log(res.status)
        this.partnerCallToActionButton = res.body;

      }, (err: HttpErrorResponse) => {
        //alert('there was an error')
        this.flashMessage.show('There was a problem with your requested data. Please contact an administrator', {
          cssClass: 'text-center alert-danger',
          timeout: 5000
        });
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
        $("#memoModal").modal("hide");
        //$("#messageModal").modal("hide");
      },
      error => console.log('error: ', error)
    )
  }

}
