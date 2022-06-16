import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RmlistService } from 'src/app/services/rmlist.service';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;

@Component({
  selector: 'app-rmlistedit',
  templateUrl: './rmlistedit.component.html',
  styleUrls: ['./rmlistedit.component.css']
})
export class RmlisteditComponent implements OnInit {
  regionRelationshipContactsForm: FormGroup;
  regionRelationshipContacts;
  id;
  phone;
  pss;
  region;
  rm;
  rsm;
  regionRelationshipContactsUser: any = Object;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

    this.id = this.route.snapshot.params['id'];

    this.rmlistService.getAllRegionRelationshipContacts().subscribe(
      res => {
        //console.log(res)
        this.regionRelationshipContacts = res;
      }
    );

    this.rmlistService.getRegionRelationshipContactsById(this.id).subscribe(
      res => {
        if(res.status === 200) {
          console.log(res.body);
          this.regionRelationshipContactsUser = res.body;
          this.regionRelationshipContactsForm.patchValue(res.body);
        }
        
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

  onSubmit(form:FormGroup, id:number) {
    console.log(id);
  }

}
