import { collectExternalReferences } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerContractNotes } from 'src/app/models/customercontractnotes';
import { RouteService } from '../../services/route.service';
declare var $: any;

@Component({
  selector: 'app-customernotesdetail',
  templateUrl: './customernotesdetail.component.html',
  styleUrls: ['./customernotesdetail.component.css']
})
export class CustomernotesdetailComponent implements OnInit {
  id;
  note:[];
  customerContractNotes: any={};

  constructor(
    private route: ActivatedRoute,
    private routeService: RouteService
  ) { 
    this.route.params.subscribe(res => {
      this.id = parseInt(res['id']);
      //console.log(typeof(this.id));
      // this.routeService.getCustomerContractNotesById(this.id).subscribe(
      //   res => {
      //     console.log(res)
      // });
    })
  }

  ngOnInit() {
    $('.modal-backdrop').remove()
    this.routeService.getCustomerContractNotes().subscribe(
      res => {
        this.customerContractNotes = res;
        //Get x number of objects from the array
        // this.customerContractNotes.forEach(
        //   (x, index) =>
        //   console.log(x, index)
        // )
        for(var i = 0; i < this.customerContractNotes.length; i++) {
          var id = this.id;
          console.log(id);
          if(this.id === this.customerContractNotes[i].customer_Notes_Id) {
            //console.log(this.customerContractNotes[i].notes);
            this.note = this.customerContractNotes[i].notes;
          }
          //debugger
        }
        console.log(this.id)
        
            // let x = note.shift();
            // this.note = x;

        // let x = note.shift();
        // this.note = x;
      }
    )

    // this.routeService.getCustomerContractNotesById(this.id).subscribe(
    //   res => {
    //     console.log(res);
    //   }
    // )
  }

}
