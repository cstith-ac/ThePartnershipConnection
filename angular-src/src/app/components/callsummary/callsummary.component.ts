import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
declare var $: any;

@Component({
  selector: 'app-callsummary',
  templateUrl: './callsummary.component.html',
  styleUrls: ['./callsummary.component.css']
})
export class CallsummaryComponent implements OnInit {
  callSummaryAddForm: FormGroup;
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

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.callSummaryAddForm = this.fb.group({
      // site: [''],
      // siteToSystemList: [''],
      // callSummaryClassList: [''],
      // callSummaryProblems: [''],
      // callSummaryResolutions: [''],
      // callSummaryNextSteps: [''],
      // customerOnCall: [''],
      // customerCallBackPhone: [''],
      // customerComments: [''],
      // resolutionNotes: ['']
      SedonaUser: this.sedonaUser = JSON.parse(localStorage.getItem('user')).afauserLink,
      site: '',
      SystemID: '',
      callSummaryClassList: '',
      ProblemID: '',
      ResolutionID: '',
      CallSummaryNextSteps: '',
      CustomerComments: '',
      TechNotes: '',
      //resolutionNotes: '',
      CustomerOnCall: '',
      CustomerCallBackPhone: ''
    })

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        //console.log(JSON.parse(localStorage.getItem('user')))
        this.sedonaUser = JSON.parse(localStorage.getItem('user')).afauserLink;
        console.log(this.sedonaUser)
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
        // let customerSiteID = "";

        // this.site.forEach((c, index, array) => {
        //   if (array.length <=1 ) {
        //     //console.log(array)
        //     document.getElementById("siteSelect").classList.add("siteSelect");
        //   } else if (array.length > 1) {
        //     //console.log(array)
        //     document.getElementById("siteSelect").style.backgroundColor = "transparent";
        //   };

        //   customerSiteID += `<option>${c.address_1}</option>`;
        // })
      }
    )

    this.routeService.getSiteToSystemList().subscribe(
      res => {
        //console.log(res)
        this.siteToSystemList = res;
        // let customerSystemID = "";
        // let alarm_Account = "";
        // let systemType = "";

        // this.siteToSystemList.forEach((s) => {
        //    systemType += `<option value="${s.customerSystemID}">${s.systemType}</option>`;
        // });

        // document.getElementById("callSummarySystemSelect").innerHTML = systemType;
      }
    )

    this.routeService.getCallSummaryClassList().subscribe(
      res => {
        //console.log(res)
        this.callSummaryClassList = res;
        // let problem_Class_id = "";
        // let problem_Class_Code = "";
        // let problem_Class_description = "";

        // this.callSummaryClassList.forEach((c) => {
        //   problem_Class_id += `<option>${c.problem_Class_id}</option>`;
        //   problem_Class_description += `<option>${c.problem_Class_description}</option>`;
        // });

        // document.getElementById("callSummaryClassListSelect").innerHTML = problem_Class_description;
      }
    )

    this.routeService.getCallSummaryProblems().subscribe(
      res => {
        this.callSummaryProblems = res;
        // let problem_Id = "";
        // let problem_Code = "";
        // let description = "";

        // this.callSummaryProblems.forEach((c) => {
        //   problem_Id += `<option>${c.problem_Id}</option>`;
        //   description += `<option value="${c.problem_Id}">${c.description}</option>`;
        // });

        // document.getElementById("callSummaryProblems").innerHTML = description;
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

    //start submit ticket

      // Set up event listeners
      // document.getElementById("callSummaryAdd").addEventListener('click', function (e) {
        
      //   let system = form.elements["system"];
      //   let callType = form.elements["callType"];
      //   let problem = form.elements["problem"];
      //   let resolution = form.elements["resolution"];
      //   let nextStep = form.elements["nextStep"];
      //   let customerOnCall = form.elements["customerOnCall"];
      //   let customerCallBackPhone = form.elements["customerCallBackPhone"];
      //   let customerComments = form.elements["customerComments"];
      //   let techNotes = form.elements["techNotes"];

      //   let systemValue = system.value; //@SystemID
      //   let problemValue = problem.value; //@ProblemID
      //   let resolutionValue = resolution.value; //@ResolutionID
      //   let nextStepValue = nextStep.value; //@NextStepID
      //   let customerOnCallValue = customerOnCall.value; //@CustomerOnCall
      //   let customerCallBackPhoneValue = customerCallBackPhone.value; //@CustomerCallBackPhone
      //   let customerCommentsValue = customerComments.value; //@CustomerComments
      //   let techNotesValue = techNotes.value; //@TechNotes

      //   let ticketNumber = document.getElementById("ticket-number");

      //   // Check for empty values
      //   //if (customerOnCallValue = "") {
      //   //  alert("PLease enter something")
      //   //} else {

      //   //}

      //   let _data = {
      //     //SedonaUser: sedonaUser,
      //     SystemID: systemValue,
      //     ProblemID: problemValue,
      //     ResolutionID: resolutionValue,
      //     NextStepID: nextStepValue,
      //     CustomerOnCall: customerOnCallValue,
      //     CustomerCallBackPhone: customerCallBackPhoneValue,
      //     CustomerComments: customerCommentsValue,
      //     TechNotes: techNotesValue
      //   }

      //   //console.log(sedonaUser); //typeof is a string. The @SedonaUser is required.
      //   //console.log(system.value); //typeof is a string. The @SystemID is required. Requires an integer
      //   console.log(systemValue);
      //   console.log(problemValue);
      //   console.log(resolutionValue);
      //   console.log(nextStepValue);
      //   console.log(customerOnCallValue);
      //   console.log(customerCallBackPhoneValue);
      //   console.log(customerCommentsValue);
      //   console.log(techNotesValue);

      //   //if (!techNotesValue == null) {
      //   //  console.log("this field is required")
      //   //}

      //   fetch("https://localhost:44390/api/CallSummaryAdd", {
      //     method: "POST",
      //     headers: {
      //       "Content-type": "application/json; charset=UTF-8",
      //       "Accept": "application/json"
      //     },
      //     body: JSON.stringify(_data)
      //   })
      //   .then(response => response.json())
      //   //.then(json => console.log(json))
      //     .then(data => {
      //       //alert("Ticket number " + data + " was created");
      //       ticketNumber.innerHTML = data;
      //       ticketNumber.className += 'ticketNumberNotification ml-0';
      //       snackbar("success", `<small style="font-weight:300">Ticket number: </small><b style='font-size:1.6rem'> ${data}</b><small style="font-weight:300">Added</small>`,3000);
      //     })
      //   .catch(err => console.log(err));

      //   e.preventDefault();
      // });
    //end submit ticket

    //Get snackbar container from the DOM
    //const snackbarContainer = document.getElementById("snackbar-container");

    //Load the snackbar
    // function snackbar(type,msg,time) {
    //   const para = document.createElement("p");
    //   para.classList.add("snackbar");
    //   para.innerHTML = `${msg} <span>&times;</span>`;

    //   if (type === "success") {
    //     //para.classList.add("success");
    //     para.classList.add("alert");
    //     para.classList.add("alert-success");
    //   }

    //   snackbarContainer.appendChild(para);
    //   para.classList.add("fadeout");

    //   setTimeout(() => {
    //     snackbarContainer.removeChild(para);
    //   }, time);
    // };

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

    this.routeService.postCallSummaryAdd(this.callSummaryAddForm.value)
      .subscribe(
        result => {
          console.log('success: ', result)
          alert("Ticket number: " + result + " was created.")
        },
        error => console.log('error: ', error)
      );
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
