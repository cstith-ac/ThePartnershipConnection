import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-incentivedashboard',
  templateUrl: './incentivedashboard.component.html',
  styleUrls: ['./incentivedashboard.component.css']
})
export class IncentivedashboardComponent implements OnInit {
  closeResult = '';
  recurringItemEntryForm: FormGroup;
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
      passThrough: new FormControl(null, {
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

  get tableRowArray(): FormArray {
    return this.recurringItemEntryForm.get('tableRowArray') as FormArray;
  }

  addNewRow(): void {
    this.tableRowArray.push(this.createTableRow());
  }

  onDeleteRow(rowIndex: number): void {
    this.tableRowArray.removeAt(rowIndex);
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

  openRecurringModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEquipMaterialsModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openLaborChargesModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
