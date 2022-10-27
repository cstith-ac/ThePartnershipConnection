import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ClassList } from 'src/app/models/classlist';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { NextSteps } from 'src/app/models/nextsteps';
import { SiteList } from 'src/app/models/sitelist';
import { SummaryProblems } from 'src/app/models/summaryproblems';
import { SummaryResolutions } from 'src/app/models/summaryresolutions';
import { SystemList } from 'src/app/models/systemlist';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';
import { numberSymbols } from '@progress/kendo-angular-intl';
declare var $: any;

@Component({
  selector: 'app-callsummary',
  templateUrl: './callsummary.component.html',
  styleUrls: ['./callsummary.component.css']
})
export class CallsummaryComponent implements OnInit {
  @ViewChild("ticketNumber") divView: ElementRef;
  @ViewChild("changeText") divText: ElementRef;

  updateWithTicket;
  updateWithCustomerSiteID;
  updateWithCustomerSystemID;
  updateResult;
  
  authToken: any;
  show: boolean = true;
  showProblem = true;

  changeToUpdateButton = false;
  showSaveButton = true;

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
  //callSummaryNextSteps: NextSteps[];
  nextStepID: NextSteps[];
  customerOnCall: '';
  customerCallBackPhone: '';
  customerComments: '';
  resolutionNotes: '';

  selectedValue: number;
  selectedCallType: number;
  selectedProblemType: number;
  clicked = false;
  enableReset = true;

  returnedTicketNumber: any;

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    public authService: AuthService,
    private http: HttpClient
  ) { 
    this.callSummaryAddForm = this.fb.group({
      SedonaUser: this.sedonaUser = JSON.parse(localStorage.getItem('user')).afauserLink,
      site: '',
      SystemID: ["", Validators.required],
      callSummaryClassList: ["", Validators.required],
      ProblemID: ["", Validators.required],
      ResolutionID: [""],
      NextStepID: [""],
      CallSummaryNextSteps: [""],
      CustomerComments: ["", Validators.required],
      TechNotes: [""],
      ResolutionNotes: ["", Validators.required],
      CustomerOnCall: [""],
      CustomerCallBackPhone: [""],
      FormStatus: [true],
      TickeNumber:""
    })
  }

  ngOnInit() {
    // console.log(this.show) // the issue has been resolved. The checkbox for Was the issue resolved? is checked by default

    this.buildForm();
    this.setIsRequiredValuesValidators();
    this.callSummaryAddForm = this.fb.group({
      SedonaUser: this.sedonaUser = JSON.parse(localStorage.getItem('user')).afauserLink,
      site: '',
      SystemID: ["", Validators.required],
      callSummaryClassList: ["", Validators.required],
      ProblemID: ["", Validators.required],
      ResolutionID: ["", Validators.required],
      NextStepID: [""],
      CallSummaryNextSteps: [""],
      CustomerComments: ["", Validators.required],
      TechNotes: [""],
      ResolutionNotes: [""],
      CustomerOnCall: [""],
      CustomerCallBackPhone: [""],
      FormStatus: [true]
    })

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        this.sedonaUser = JSON.parse(localStorage.getItem('user')).afauserLink;
      },
      err => {
        console.log(err);
      }
    )

    this.routeService.getCustomerCareDashboardInfoS().subscribe(
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
        this.callSummaryClassList = res;
      }
    )

    this.routeService.getCallSummaryResolutions().subscribe(
      res => {
        this.callSummaryResolutions = res;
      }
    )

    this.routeService.getCallSummaryNextSteps().subscribe(
      res => {
        this.nextStepID = res;
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

  buildForm() {
    this.callSummaryAddForm = this.fb.group({
      SedonaUser: this.sedonaUser = JSON.parse(localStorage.getItem('user')).afauserLink,
      site: '',
      SystemID: ["", Validators.required],
      callSummaryClassList: ["", Validators.required],
      ProblemID: ["", Validators.required],
      ResolutionID: [""],
      NextStepID: [""],
      CallSummaryNextSteps: [""],
      CustomerComments: [""],
      TechNotes: [""],
      ResolutionNotes: [""],
      CustomerOnCall: [""],
      CustomerCallBackPhone: [""],
      FormStatus: [true]
    })
  }

  setIsRequiredValuesValidators() {
    const resolutionIDControl = this.callSummaryAddForm.get("ResolutionID");
    //const callSummaryNextStepsControl = this.callSummaryAddForm.get("CallSummaryNextSteps");
    const callSummaryNextStepsControl = this.callSummaryAddForm.get("NextStepID");
    const customerCommentsControl = this.callSummaryAddForm.get("CustomerComments");
    const techNotesControl = this.callSummaryAddForm.get("TechNotes");
    const resolutionNotesControl = this.callSummaryAddForm.get("ResolutionNotes");
    const customerOnCallControl = this.callSummaryAddForm.get("CustomerOnCall");
    const customerCallBackPhoneControl = this.callSummaryAddForm.get("CustomerCallBackPhone");

    this.callSummaryAddForm.get("FormStatus").valueChanges.subscribe(
      (FormStatus => {
        //console.log(typeof(FormStatus))
        if(FormStatus === true) {
          //the issue was resolved / checked
          // console.log(FormStatus)
          // console.log(customerOnCallControl);
          // console.log(customerCallBackPhoneControl);
          resolutionIDControl.setValidators([Validators.required]);
          callSummaryNextStepsControl.setValidators(null);
          customerCommentsControl.setValidators([Validators.required]);
          techNotesControl.setValidators(null);
          resolutionNotesControl.setValidators([Validators.required]);
          customerOnCallControl.setValidators(null);
          customerCallBackPhoneControl.setValidators(null);
          //this.callSummaryAddForm.setValue({status:"Valid"});
          // this.callSummaryAddForm.removeControl("CustomerOnCall")
          // this.callSummaryAddForm.removeControl("CustomerCallBackPhone")
        }

        if(FormStatus === false) {
          //the issue was unresolved / unchecked
          console.log(FormStatus)
          // console.log(customerOnCallControl);
          // console.log(customerCallBackPhoneControl);
          resolutionIDControl.setValidators(null);
          callSummaryNextStepsControl.setValidators([Validators.required]);
          customerCommentsControl.setValidators([Validators.required]);
          techNotesControl.setValidators([Validators.required]);
          resolutionNotesControl.setValidators(null);
          customerOnCallControl.setValidators([Validators.required]);
          customerCallBackPhoneControl.setValidators([Validators.required]);
        }

        resolutionIDControl.updateValueAndValidity();
        customerOnCallControl.updateValueAndValidity();
        callSummaryNextStepsControl.updateValueAndValidity();
        customerCommentsControl.updateValueAndValidity();
        techNotesControl.updateValueAndValidity();
        resolutionNotesControl.updateValueAndValidity();
        customerOnCallControl.updateValueAndValidity();
        customerCallBackPhoneControl.updateValueAndValidity();
      })
    )
  }

  // if the issue was resolved (checked = true), don't require customer on call and customer call back phone
  // else if the issue was not resolved, require customer on call and customer call back phone

  isIssueResolved(event){
    if(event.target.checked) {
      this.show = true; // default value
      //checked
      const resolutionIDControl = this.callSummaryAddForm.get("ResolutionID");
      const customerOnCallControl = this.callSummaryAddForm.get("CustomerOnCall");
      const customerCallBackPhoneControl = this.callSummaryAddForm.get("CustomerCallBackPhone");
      const customerCommentsControl = this.callSummaryAddForm.get("CustomerComments");
      const techNotesControl = this.callSummaryAddForm.get("TechNotes");
      const callSummaryNextStepsControl = this.callSummaryAddForm.get("NextStepID");
      const resolutionNotesControl = this.callSummaryAddForm.get("ResolutionNotes");

      resolutionIDControl.setValidators([Validators.required]);
      resolutionIDControl.setValue('');
      resolutionIDControl.updateValueAndValidity();
      customerOnCallControl.setValidators(null);
      customerOnCallControl.updateValueAndValidity();
      customerCallBackPhoneControl.setValidators(null);
      customerCallBackPhoneControl.updateValueAndValidity();
      customerCommentsControl.setValidators(null);
      customerCommentsControl.updateValueAndValidity();
      techNotesControl.setValidators(null);
      techNotesControl.updateValueAndValidity();
      callSummaryNextStepsControl.setValidators(null);
      callSummaryNextStepsControl.setValue(1);
      callSummaryNextStepsControl.updateValueAndValidity();
      resolutionNotesControl.setValidators([Validators.required]);
      resolutionNotesControl.updateValueAndValidity();

      //console.log(event.target.checked)

      // if(this.show = true) {
      //     let cust = this.callSummaryAddForm.controls["CustomerOnCall"].status;
      //     let numb = this.callSummaryAddForm.controls["CustomerCallBackPhone"].status;
      //     cust.toString();
      //     numb.toString();
      //     cust.replace("INVALID","VALID"); //Return a string where "x" is replaced with "y"
      //     numb.replace("INVALID","VALID"); //Return a string where "x" is replaced with "y"

      //     // Customer on call and customer call back phone are not required
      //     // mark the field Customer On Call as not required
      //     this.callSummaryAddForm.controls['CustomerOnCall'].markAsTouched();
      //     this.callSummaryAddForm.controls['CustomerOnCall'].patchValue({[status]:"Valid"})

      //     this.callSummaryAddForm.controls['CustomerCallBackPhone'].markAsTouched();
      //     this.callSummaryAddForm.controls['CustomerCallBackPhone'].patchValue({status:"Valid"})
      // }

      // while(this.show = true) {
      //   let cust = this.callSummaryAddForm.controls["CustomerOnCall"].status;
      //   let numb = this.callSummaryAddForm.controls["CustomerCallBackPhone"].status;
      //   cust.toString();
      //   numb.toString();
      //   cust.replace("INVALID","VALID"); //Return a string where "x" is replaced with "y"
      //   numb.replace("INVALID","VALID"); //Return a string where "x" is replaced with "y"

      //   // Customer on call and customer call back phone are not required
      //   // mark the field Customer On Call as not required
      //   this.callSummaryAddForm.controls['CustomerOnCall'].markAsTouched();
      //   this.callSummaryAddForm.controls['CustomerOnCall'].patchValue({[status]:"Valid"})

      //   this.callSummaryAddForm.controls['CustomerCallBackPhone'].markAsTouched();
      //   this.callSummaryAddForm.controls['CustomerCallBackPhone'].patchValue({status:"Valid"})
        
      //   return
      // }
      
    } else {
      this.show = false;
      //unchecked
      const resolutionIDControl = this.callSummaryAddForm.get("ResolutionID");
      const customerOnCallControl = this.callSummaryAddForm.get("CustomerOnCall");
      const customerCallBackPhoneControl = this.callSummaryAddForm.get("CustomerCallBackPhone");
      const customerCommentsControl = this.callSummaryAddForm.get("CustomerComments");
      const techNotesControl = this.callSummaryAddForm.get("TechNotes");
      const callSummaryNextStepsControl = this.callSummaryAddForm.get("NextStepID");
      const resolutionNotesControl = this.callSummaryAddForm.get("ResolutionNotes");

      resolutionIDControl.setValidators(null);
      resolutionIDControl.setValue(1);
      resolutionIDControl.updateValueAndValidity();
      customerOnCallControl.setValidators([Validators.required]);
      customerOnCallControl.updateValueAndValidity();
      customerCallBackPhoneControl.setValidators([Validators.required]);
      customerCallBackPhoneControl.updateValueAndValidity();
      customerCommentsControl.setValidators([Validators.required]);
      customerCommentsControl.updateValueAndValidity();
      techNotesControl.setValidators([Validators.required]);
      techNotesControl.updateValueAndValidity();
      callSummaryNextStepsControl.setValidators([Validators.required]);
      callSummaryNextStepsControl.updateValueAndValidity();
      resolutionNotesControl.setValidators(null);
      resolutionNotesControl.updateValueAndValidity();

      //console.log(event.target.checked)

      // customer on call and customer call back phone are required
      // while(this.show = false) {

      //   let cust = this.callSummaryAddForm.controls["CustomerOnCall"].status;
      //   let numb = this.callSummaryAddForm.controls["CustomerCallBackPhone"].status;
      //   cust.toString();
      //   numb.toString();
      //   cust.replace("VALID","INVALID"); //Return a string where "x" is replaced with "y"
      //   numb.replace("VALID","INVALID"); //Return a string where "x" is replaced with "y"

      //   this.callSummaryAddForm.controls['CustomerOnCall'].markAsUntouched()
      //   this.callSummaryAddForm.controls['CustomerOnCall'].patchValue({[status]:"INVALID"})

      //   this.callSummaryAddForm.controls['CustomerCallBackPhone'].markAsUntouched();
      //   this.callSummaryAddForm.controls['CustomerCallBackPhone'].patchValue({status:"INVALID"})
      //   return
      // }
    }
  }

  selectCustToSite(val: any) {
   this.changeSystem(val)
   debugger
  }

  changeSystem(val: any) {
    let id = val;
    //append id to get getCustomerToSiteList
    if(id !== undefined) {
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
            //console.log(res)
            this.siteToSystemList = [].concat(res);
          }
  
          //this.siteToSystemList = [].concat(res);
        }
      )
    }
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  //Get the Problem_class_id of call type / class list
  showProblemsBasedOnClassSelect(val: any) {
    this.customFunction(val);
  }

  //Change the Problems dropdown based on the selection of Call Type 
  customFunction(val: any) {
    if(val === 5) {

      this.callSummaryProblems = []; // ==> CORRECT

      //exec dbo.CallSummaryProblems O - execute CallSummaryProblems with a parameter of Other if this is selected
      this.routeService.getCallSummaryProblemsO().subscribe(
        res => {
          this.callSummaryProblems = res;
        }
      )
      //then change options in Problems dropdown
    }
    if(val === 1) {

      this.callSummaryProblems = []; // ==> CORRECT

       //exec dbo.CallSummaryProblems S - execute CallSummaryProblems with a parameter of Service if this is selected
       this.routeService.getCallSummaryProblemsS().subscribe(
         res => {
           this.callSummaryProblems = res;
         }
       )
       //then change options in Problems dropdown
    }
    if(val === 2) {

      this.callSummaryProblems = []; // ==> CORRECT

       //dbo.CallSummaryProblems CC - execute CallSummaryProblems with a parameter of Customer Care 
       
       this.routeService.getCallSummaryProblems().subscribe(
         res => {
           this.callSummaryProblems = res;
         }
       )
    }
    if(val === 3) {

      this.callSummaryProblems = []; // ==> CORRECT

       //exec dbo.CallSummaryProblems IC - execute CallSummaryProblems with a parameter of Incentives if this is selected
       this.routeService.getCallSummaryProblemsIC().subscribe(
         res => {;
           this.callSummaryProblems = res;
         }
       )
       //then change options in Problems dropdown
    }
    if(val === 4) {

      this.callSummaryProblems = []; // ==> CORRECT

       //exec dbo.CallSummaryProblems IV - execute CallSummaryProblems with a parameter of Invoicing if this is selected
       this.routeService.getCallSummaryProblemsIV().subscribe(
         res => {;
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

    //console.log(this.callSummaryAddForm.value);
    // if(form.value.SystemID === null) {
    //   this.siteToSystemList = 1
    // }
    //this.callSummaryAddForm.setErrors({ 'invalid': false });
    // form.value.CustomerOnCall="";
    
    // commented code below causes form to remain invalid until ALL fields are completed
    if(this.callSummaryAddForm.invalid) {
      //alert('this form is not valid')
      return;
    }
    
    if(this.callSummaryAddForm.controls["NextStepID"].value == "") {
      this.callSummaryAddForm.controls["NextStepID"].setValue(1);
    }

    if(this.callSummaryAddForm.valid) {
      console.log(this.callSummaryAddForm.value)
      confirm('Click ok to confirm form submission')

      //display a confirmation box asking if the user is sure they would like to submit
      //if yes, submit http request
      //if no, return

      this.routeService.postCallSummaryAdd(this.callSummaryAddForm.value)
      .subscribe(
        result => {
          // confirm('Click ok to confirm form submission')

          // this.divText.nativeElement.innerHTML = "Update";

          // or remove the former button and replace with an update button
          this.changeToUpdateButton = true;
          this.showSaveButton = false;

          this.returnedTicketNumber = result;
          this.divView.nativeElement.innerHTML = result;
          this.submitted = false;
          this.clicked = false;
          this.enableReset = false;
          // this.callSummaryAddForm.reset(); //this resets the form fields but is creating another HTTP Get request
          //this.resetForm(form);
        },
        error => console.log('error: ', error)
      );
    }
  }

  updateForm(e) {
    e.preventDefault();
    console.log(this.returnedTicketNumber);
    console.log(this.callSummaryAddForm.value);
    
    var addToObject = function (obj, key, value) {

      // Create a temp object and index variable
      var temp = {};
      var i = 0;
    
      // Loop through the original object
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
    
          // If the indexes match, add the new item
          if (i === key && value) {
            temp[key] = value;
          }
    
          // Add the current item in the loop to the temp obj
          temp[prop] = obj[prop];
    
          // Increase the count
          i++;
    
        }
      }
    
      // If no index, add to the end
      if (key && value) {
        temp[key] = value;
      }
    
      return temp;
    
    };
    //update object with TicketNumber, CustomerSiteID, CustomerSystemID
    var updateWithTicket = addToObject(this.callSummaryAddForm.value,'TicketNumber',this.returnedTicketNumber);
    var updateWithCustomerSiteID = addToObject(this.callSummaryAddForm.value,'CustomerSiteID',this.callSummaryAddForm.controls["site"].value);
    var updateWithCustomerSystemID = addToObject(this.callSummaryAddForm.value,'CustomerSystemID',this.callSummaryAddForm.controls["SystemID"].value);
    console.log(updateWithTicket)//Object
    console.log(updateWithCustomerSiteID);
    console.log(updateWithCustomerSystemID);

    this.updateWithTicket = updateWithTicket;
    this.updateWithCustomerSiteID = updateWithCustomerSiteID;
    this.updateWithCustomerSystemID = updateWithCustomerSystemID;
    this.updateResult = {
      ...this.updateWithTicket,
      ...this.updateWithCustomerSiteID,
      ...this.updateWithCustomerSystemID
    }
    console.log(this.updateResult);
    this.routeService.putCallSummaryUpdate(this.returnedTicketNumber,this.updateResult).subscribe(
      res => {
        console.log(res);
        //display notification if 200 OK received
        alert("Ticket updated successfully");
      }
    )
  }

  // Clear the UI 
  ticketFieldResetButton() {
    // this.divView.nativeElement.innerHTML = '';
    // this.clicked = false;
    this.submitted = false;
    this.callSummaryAddForm.reset()
  }

  resetForm(form: FormGroup) {
    this.submitted = false;
    //form.markAllAsTouched();
    form.markAsUntouched();
    form.markAsPristine();
    form.clearValidators();
    this.callSummaryAddForm.reset(this.callSummaryAddForm.value);
  }
}