import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RmlistService } from 'src/app/services/rmlist.service';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;

@Component({
  selector: 'app-rmlist',
  templateUrl: './rmlist.component.html',
  styleUrls: ['./rmlist.component.css']
})
export class RmlistComponent implements OnInit {
  regionRelationshipContactsForm: FormGroup;
  regionRelationshipContacts;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public rmlistService: RmlistService,
    public jwtHelper: JwtHelperService
  ) { }

  ngOnInit() {
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    $("#wrapper").addClass("toggled");

    this.rmlistService.getAllRegionRelationshipContacts().subscribe(
      res => {
        //console.log(res)
        this.regionRelationshipContacts = res;
      }
    )

    this.regionRelationshipContactsForm = this.fb.group({
      id: "",
      rm: "",
      rsm: "",
      pss: "",
      phone: "",
      region: ""
    });
  }

  editCurrentRM(id:number, rm:string, rsm:string, pss:string, phone:string, region:string) {
    // console.log(id);
    // console.log(rm);
    // console.log(rsm);
    // console.log(pss);
    // console.log(phone);
    // console.log(region);
    this.router.navigate(['rmlist-edit/'+ id]);
  }

  onSubmit(form:FormGroup, id:number) {
    console.log(id);
  }

  deleteRM(e, id:number) {
    console.log(e);
    console.log(id);
  }

  exportToExcel() {
    console.log('export')
  }

}
