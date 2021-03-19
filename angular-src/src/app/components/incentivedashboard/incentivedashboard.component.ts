import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-incentivedashboard',
  templateUrl: './incentivedashboard.component.html',
  styleUrls: ['./incentivedashboard.component.css']
})
export class IncentivedashboardComponent implements OnInit {
  @Input() event:any;

  closeResult = '';
  incentiveEntryForm: FormGroup;
  recurringItemEntryForm: FormGroup;
  customer: '';
  site: '';
  system: '';
  newSystem: '';
  newCustomer: '';
  newSite: '';
  accountNumber: '';
  panelType: '';
  location: '';
  centralStation: '';
  additionalInfo: '';
  invoiceUpload: '';
  siteVisitUpload: '';
  contractUpload: '';
  subscriberFormUpload: '';
  otherDocument1Upload: '';
  otherDocument2Upload: '';
  invoiceNumber: '';
  invoiceTotal: '';
  tax: '';
  recurring: '';
  equipmentAndMaterials: '';
  laborCharges: '';
  lineItemSubtotal: '';
  startDate: '';
  term: '';
  signalsTested: '';

  columns: string[];

  constructor(
    private router: Router,
    private routeService: RouteService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) { 
    this.columns = ['Item', 'Description', 'Bill Cycle', 'RMR', 'Pass Through', 'Billing Starts', 'Add To An Existing RMR Item', 'Multiple', 'Total']
  }

  ngOnInit() {
    this.incentiveEntryForm = this.fb.group({
      customer: '',
      site: '',
      system: '',
      newSystem: '',
      newCustomer: '',
      newSite: '',
      accountNumber: '',
      panelType: '',
      location: '',
      centralStation: '',
      additionalInfo: '',
      invoiceUpload: '',
      siteVisitUpload: '',
      contractUpload: '',
      subscriberFormUpload: '',
      otherDocument1Upload: '',
      otherDocument2Upload: '',
      invoiceNumber: '',
      invoiceTotal: '',
      tax: '',
      recurring: '',
      equipmentAndMaterials: '',
      laborCharges: '',
      lineItemSubtotal: '',
      startDate: '',
      term: '',
      signalsTested: ''
    })


    this.recurringItemEntryForm = this.fb.group({
      //table => item, description, bill cycle, rmr, pass through, billing starts, add to an existing rmr item, multiple, total
    })
  }

  private createForm(): void {
    this.recurringItemEntryForm = this.fb.group({
      //tableRowArray is a FormArray which holds a list of FormGroups
      tableRowArray: this.fb.array([
        this.createTableRow()
      ])
    })
  }

  private createTableRow(): FormGroup {
    return this.fb.group({
      item: new FormControl(null, {
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        validators: [Validators.required]
      }),
      billCycle: new FormControl(null, {
        validators: [Validators.required]
      }), 
      rmr: new FormControl(null, {
        validators: [Validators.required]
      }),
      passhrough: new FormControl(null, {
        validators: [Validators.required]
      }),
      billingStarts: new FormControl(null, {
        validators: [Validators.required]
      }),
      addToAnExistingRmrItem: new FormControl(null, {
        validators: [Validators.required]
      }),
      multiple: new FormControl(null, {
        validators: [Validators.required]
      }),
      total: new FormControl(null, {
        validators: [Validators.required]
      })
    })
  }

  onSubmit(form: FormGroup) {
    console.log(form.value.customer)
  }

  routeToNewCustomer() {
    console.log('go to new customer')
    //Holding off on this until TBD
    //this.router.navigate(["new-customer"]);
  }

  routeToNewSite() {
    console.log('go to new site');
    //Holding off on this until TBD
    //this.router.navigate(["new-site"]);
  }

  routeToRecurring() {
    this.router.navigate(["incentive-recurring"]);
  }

  routeToEquipMaterials() {
    this.router.navigate(["incentive-equipment-materials"]);
  }

  routeToLaborCharges() {
    this.router.navigate(["incentive-labor-charges"]);
  }

  // openRecurringModal(content) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     console.log(result)
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // openEquipMaterialsModal(content) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     console.log(result)
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // openLaborChargesModal(content) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     console.log(result)
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

}
