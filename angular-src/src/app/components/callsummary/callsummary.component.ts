import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ClassList } from 'src/app/models/classlist';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { NextSteps } from 'src/app/models/nextsteps';
import { SiteList } from 'src/app/models/sitelist';
import { SummaryProblems } from 'src/app/models/summaryproblems';
import { SummaryResolutions } from 'src/app/models/summaryresolutions';
import { SystemList } from 'src/app/models/systemlist';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-callsummary',
  templateUrl: './callsummary.component.html',
  styleUrls: ['./callsummary.component.css']
})
export class CallsummaryComponent implements OnInit {
  @ViewChild("ticketNumber") divView: ElementRef;
  
  authToken: any;
  show: boolean = true;

  callSummaryAddForm: FormGroup;
  submitted = false;
  user:any=Object;
  sedonaUser: '';

  custNameNumb: DashboardInfo[];
  site: SiteList[];
  siteToSystemList: SystemList[];
  callSummaryClassList: ClassList[];
  callSummaryProblems: SummaryProblems[];
  callSummaryResolutions: SummaryResolutions[];
  callSummaryNextSteps: NextSteps[];
  customerOnCall: '';
  customerCallBackPhone: '';
  customerComments: '';
  resolutionNotes: '';

  selectedValue: number;
  selectedCallType: number;
  clicked = false;
  enableReset = true;

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    public authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.callSummaryAddForm = this.fb.group({
      SedonaUser: this.sedonaUser = JSON.parse(localStorage.getItem('user')).afauserLink,
      site: '',
      SystemID: ["", Validators.required],
      callSummaryClassList: ["", Validators.required],
      ProblemID: ["", Validators.required],
      ResolutionID: ["", Validators.required],
      CallSummaryNextSteps: ["", Validators.required],
      CustomerComments: ["", Validators.required],
      TechNotes: ["", Validators.required],
      CustomerOnCall: ["", Validators.required],
      CustomerCallBackPhone: ["", [Validators.required, Validators.minLength(10), Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$')]]
    })

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        //console.log(JSON.parse(localStorage.getItem('user')))
        this.sedonaUser = JSON.parse(localStorage.getItem('user')).afauserLink;
        //console.log(this.sedonaUser)
        //console.log(JSON.parse(localStorage.getItem('user')).afauserLink)
      },
      err => {
        console.log(err);
      }
    )

    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        this.custNameNumb = res;
      }
    )

    this.routeService.getCustomerToSiteList().subscribe(
      res => {
        this.site = res;
      }
    )

    this.routeService.getCallSummaryClassList().subscribe(
      res => {
        //console.log(res)
        this.callSummaryClassList = res;
      }
    )

    this.routeService.getCallSummaryProblems().subscribe(
      res => {
        this.callSummaryProblems = res;
      }
    )

    this.routeService.getCallSummaryResolutions().subscribe(
      res => {
        this.callSummaryResolutions = res;
      }
    )

    this.routeService.getCallSummaryNextSteps().subscribe(
      res => {
        this.callSummaryNextSteps = res;
      }
    )

    $("#showCallSummaryModal").click(function (e) {
      e.preventDefault();
      $("#callSummaryModal").modal("show");
      //moveResizeModal()
    })

    $("#hideCallSummaryModal").click(function (e) {
      e.preventDefault();
      $("#callSummaryModal").modal("hide");
    })
  }

  isIssueResolved(event){
    if(event.target.checked) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  selectCustToSite(val: any) {
   this.changeSystem(val)
  }

  changeSystem(val: any) {
    let id = val;
    //append id to get getCustomerToSiteList
    this.routeService.getSiteToSystemList(id).subscribe(
      res => {
        //if dbo.SiteToSystemList returns a null value, insert 1 as default value
        if(res === null) {
          console.log(res)
          fetch(`http://localhost:63052/api/SiteToSystemList/1`)
            .then(res => {
              console.log(res)
            })
          
          this.siteToSystemList = [].concat(res);
       
        } else {
          console.log(res)
          this.siteToSystemList = [].concat(res);
        }

        //this.siteToSystemList = [].concat(res);
      }
    )
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  //Get the Problem_class_id of call type / class list
  showProblemsBasedOnClassSelect(val: any) {
    this.customFunction(val);
    //console.log(val)
  }

  //Change the Problems dropdown based on the selection of Call Type 
  customFunction(val: any) {
    if(val === 5) {
      console.log("The id selected is: " + val);
      //execute CallSummaryProblems with a parameter of Other if this is selected
      //exec dbo.CallSummaryProblems O
      this.routeService.getCallSummaryProblemsO().subscribe(
        res => {
          console.log(res);
          this.callSummaryProblems = res;
        }
      )
      //then change options in Problems dropdown
    }
    if(val === 1) {
      console.log("The id selected is: " + val);
       //execute CallSummaryProblems with a parameter of S if this is selected
       //exec dbo.CallSummaryProblems S
       this.routeService.getCallSummaryProblemsS().subscribe(
         res => {
           //console.log(res);
           this.callSummaryProblems = res;
         }
       )
       //then change options in Problems dropdown
    }
    if(val === 2) {
      console.log("The id selected is: " + val);
       //execute CallSummaryProblems with a parameter of CC 
       //exec dbo.CallSummaryProblems CC -- this is called and displayed as a default dropdown value for Problems
       this.routeService.getCallSummaryProblems().subscribe(
         res => {
          this.callSummaryProblems = res;
         }
       )
    }
    if(val === 3) {
      console.log("The id selected is: " + val);
       //execute CallSummaryProblems with a parameter of Incentives if this is selected
       //exec dbo.CallSummaryProblems IC
       this.routeService.getCallSummaryProblemsIC().subscribe(
         res => {
           //console.log(res);
           this.callSummaryProblems = res;
         }
       )
       //then change options in Problems dropdown
    }
    if(val === 4) {
      console.log("The id selected is: " + val);
       //execute CallSummaryProblems with a parameter of Invoicing if this is selected
       //exec dbo.CallSummaryProblems IV
       this.routeService.getCallSummaryProblemsIV().subscribe(
         res => {
           //console.log(res);
           this.callSummaryProblems = res;
         }
       )
       //then change options in Problems dropdown
    }
  }

  get f() {
    return this.callSummaryAddForm.controls;
  }

  onSubmit(form: FormGroup) {

    this.submitted = true;

    console.log(this.callSummaryAddForm.value);
    // if(form.value.SystemID === null) {
    //   this.siteToSystemList = 1
    // }

    this.routeService.postCallSummaryAdd(this.callSummaryAddForm.value)
      .subscribe(
        result => {
          confirm('Click ok to confirm form submission')
          this.divView.nativeElement.innerHTML = result;
          this.submitted = false;
          this.clicked = true;
          this.enableReset = false;
          //this.callSummaryAddForm.reset(); //this resets the form fields but is creating another HTTP Get request
          this.resetForm(form);
        },
        error => console.log('error: ', error)
      );
  }

  // Clear the ticket number from the UI 
  ticketFieldResetButton() {
    this.divView.nativeElement.innerHTML = '';
    this.clicked = false;
  }

  resetForm(form: FormGroup) {
    this.submitted = false;
    form.markAllAsTouched();
    this.callSummaryAddForm.reset(this.callSummaryAddForm.value);
  }

}
