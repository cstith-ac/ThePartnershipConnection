import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AspNetUsers } from 'src/app/models/aspnetusers';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-adminedit',
  templateUrl: './adminedit.component.html',
  styleUrls: ['./adminedit.component.css']
})
export class AdmineditComponent implements OnInit {
  id: number;
  aspnetuser: AspNetUsers[];
  updateAspNetUserForm: FormGroup;
  user:any=Object;

  constructor(
    public routeService: RouteService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.routeService.getUser(this.id).subscribe(
      res => {
        this.user = res;
      },
      err => {
        console.log(err);
      }
    )

    this.routeService.getUser(this.id)
      //.pipe(first())
      .subscribe(x => this.updateAspNetUserForm.patchValue(x));

    this.updateAspNetUserForm = this.fb.group({
      id: "",
      userName: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      cellPhoneNumber1: "",
      altEmail: "",
      afauserLink: "",
      password: "",
      confirmPassword: ""
    })
  }

  onSubmit(form: FormGroup) {
    console.log('Email: ', form.value.email)
    console.log('First name: ', form.value.firstName)
    console.log('Last name: ', form.value.lastName)
    console.log('Phone number: ', form.value.phoneNumber)
    console.log('Cell: ', form.value.cellPhoneNumber1)
    console.log('Alt email: ', form.value.altEmail)
    console.log('Password: ', form.value.password)
    console.log('Password: ', form.value.confirmPassword)
  }

}
