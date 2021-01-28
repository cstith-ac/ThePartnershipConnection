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

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    public authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.callSummaryAddForm = this.fb.group({
      // SedonaUser: this.sedonaUser = JSON.parse(localStorage.getItem('user')).afauserLink,
      // site: '',
      // SystemID: '',
      // callSummaryClassList: '',
      // ProblemID: '',
      // ResolutionID: '',
      // CallSummaryNextSteps: '',
      // CustomerComments: '',
      // TechNotes: '',
      // CustomerOnCall: '',
      // CustomerCallBackPhone: ''
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
      CustomerCallBackPhone: ["", Validators.required]
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

    // this.routeService.getSiteToSystemList(id).subscribe(
    //   res => {
    //     //console.log(res)
    //     this.siteToSystemList = res;
    //   }
    // )

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
        // let resolution_Id = "";
        // let resolution_Code = "";
        // let description = "";

        // this.callSummaryResolutions.forEach((c) => {
        //   resolution_Id += `<option>${c.resolution_Id}</option>`;
        //   description += `<option value="${c.resolution_Id}">${c.description}</option>`;
        // });

        // document.getElementById("callSummaryResolutions").innerHTML = description;
      }
    )

    this.routeService.getCallSummaryNextSteps().subscribe(
      res => {
        this.callSummaryNextSteps = res;
        // let employeeID = "";
        // let employeeName = "";

        // this.callSummaryNextSteps.forEach((c) => {
        //   employeeID += `<option>${c.employeeID}</option>`;
        //   employeeName += `<option value="${c.employeeID}">${c.employeeName}</option>`;
        // });

        // document.getElementById("callSummaryNextSteps").innerHTML = employeeName;
      }
    )

    $("#showCallSummaryModal").click(function (e) {
      e.preventDefault();
      $("#callSummaryModal").modal("show");
      moveResizeModal()
    })

    $("#hideCallSummaryModal").click(function (e) {
      e.preventDefault();
      $("#callSummaryModal").modal("hide");
    })

    // Move and resize modals
    function moveResizeModal() {
      $(".modal-header").on('mousedown', function (downEvt) {
        var $draggable = $(this)
        var x = downEvt.pageX - $draggable.offset().left,
          y = downEvt.pageY - $draggable.offset().top;
        $('body').on('mousemove.draggable', function (moveEvt) {
          $draggable.closest(".modal-dialog").offset({
            "left": moveEvt.pageX - x,
            "top": moveEvt.pageY - y
          })
        })
        $('.modal-content').resizable({
          //alsoResize: ".modal-dialog",
          minHeight: 300,
          minWidth: 300
        });
        $('body').on('mouseup', function () {
          $("body").off("mousemove.draggable")
        })
        $draggable.closest(".modal").one("bs.modal.hide", function () {
          $("body").off("mousemove.draggable")
        })
      })
    }
  }

  // ngAfterViewInit() {
  //   console.log(this.divView)
  // }

  selectCustToSite(val: any) {
   this.changeSystem(val)
  }

  changeSystem(val: any) {
    let id = val;
    //console.log(id);
    //append id to get getCustomerToSiteList
    this.routeService.getSiteToSystemList(id).subscribe(
      res => {
        //console.log(res);
        this.siteToSystemList = [].concat(res);
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
    //console.log('Valid?', form.valid); // true or false
    console.log('SedonaUser', this.sedonaUser);
    console.log('SystemID', form.value.SystemID);
    //console.log('callSummaryClassList', form.value.callSummaryClassList);//not required
    console.log('ProblemID', form.value.ProblemID);
    console.log('ResolutionID', form.value.ResolutionID);
    console.log('NextStepID', form.value.CallSummaryNextSteps);
    console.log('CustomerOnCall', form.value.CustomerOnCall);
    console.log('CustomerCallBackPhone', form.value.CustomerCallBackPhone);
    console.log('CustomerComments', form.value.CustomerComments);
    console.log('TechNotes', form.value.TechNotes);

    this.submitted = true;

    if(this.callSummaryAddForm.invalid) {
      return;
    }

    // alert(
    //   "SUCCESS!! :-)\n\n" + JSON.stringify(this.callSummaryAddForm.value, null, 4)
    // )

    this.routeService.postCallSummaryAdd(this.callSummaryAddForm.value)
      .subscribe(
        result => {
          this.resetForm(form);
          // console.log('success: ', result)
          // alert("Ticket number: " + result + " was created.")
          this.divView.nativeElement.innerHTML = result;
        },
        error => console.log('error: ', error)
      );
  }

  resetForm(form: FormGroup) {
    this.submitted = false;
    form.reset();
  }

  onCallSummaryAddSubmit() {
    
  }

  isIssueResolved() {
    //Get the checkbox
    let checkBox = document.getElementById("isIssueResolved") as HTMLInputElement;
    //Get the Resolution select
    let resolution = document.getElementById("resolution");
    //Get the Next Step select
    let nextStep = document.getElementById("nextStep");
    //Get Customer Comments text area
    let customerComments = document.getElementById("custCommentsTextArea");
    //Get Resolution Notes text area
    let resolutionNotes = document.getElementById("resNotesTextArea");

    //If the checkbox is checked, display the Resolution select. Otherwise, display Next Step select
    if (checkBox.checked == true) {
      //yes, the issue was resolved
      resolution.style.display = "block";
      nextStep.style.display = "none";
      //customerComments.style.display = "none";
      //resolutionNotes.style.display = "block";
    } else {
      //no, the issue was not resolved
      resolution.style.display = "none";
      nextStep.style.display = "block";
      //customerComments.style.display = "block";
      //resolutionNotes.style.display = "none";
    }
  }

}
