import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
//import 'rxjs/add/operator/map';
import { AuthGuard } from '../app/guards/auth.guard';
import { NgxMaskModule } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';

import { ValidateService } from '../app/services/validate.service';
import { AuthService } from '../app/services/auth.service';
//import { UserService } from './services/user.service';
import { CustomeraccesslistComponent } from './components/customeraccesslist/customeraccesslist.component';
import { CustomercaredashboardinfoComponent } from './components/customercaredashboardinfo/customercaredashboardinfo.component';
import { CustomersysteminfoComponent } from './components/customersysteminfo/customersysteminfo.component';
import { CcassistantSystemsComponent } from './components/ccassistant-systems/ccassistant-systems.component';
import { PartnercontactlistComponent } from './components/partnercontactlist/partnercontactlist.component';
import { PartnerinformationComponent } from './components/partnerinformation/partnerinformation.component';
import { SitetosystemlistComponent } from './components/sitetosystemlist/sitetosystemlist.component';
import { CustomertositelistComponent } from './components/customertositelist/customertositelist.component';
import { CallsummaryclasslistComponent } from './components/callsummaryclasslist/callsummaryclasslist.component';
import { CallsummaryproblemsComponent } from './components/callsummaryproblems/callsummaryproblems.component';
import { CallsummaryresolutionsComponent } from './components/callsummaryresolutions/callsummaryresolutions.component';
import { CallsummarynextstepsComponent } from './components/callsummarynextsteps/callsummarynextsteps.component';
import { CallsummaryaddComponent } from './components/callsummaryadd/callsummaryadd.component';
import { RouteService } from './services/route.service';
import { CallsummaryComponent } from './components/callsummary/callsummary.component';
import { SuggestedtopicsComponent } from './components/suggestedtopics/suggestedtopics.component';
import { CriticalmessageComponent } from './components/criticalmessage/criticalmessage.component';
import { SysteminfoComponent } from './components/systeminfo/systeminfo.component';
import { SysteminfodetailComponent } from './components/systeminfodetail/systeminfodetail.component';
import { RecentcustomersComponent } from './components/recentcustomers/recentcustomers.component';
import { CurrentuserComponent } from './components/currentuser/currentuser.component';
import { PartnerwindowComponent } from './components/partnerwindow/partnerwindow.component';
import { ProfileeditComponent } from './components/profileedit/profileedit.component';
import { CustomerratingbuttonComponent } from './components/customerratingbutton/customerratingbutton.component';
import { CustomernotesdetailComponent } from './components/customernotesdetail/customernotesdetail.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    HomeComponent,
    CustomeraccesslistComponent,
    CustomercaredashboardinfoComponent,
    CustomersysteminfoComponent,
    CcassistantSystemsComponent,
    PartnercontactlistComponent,
    PartnerinformationComponent,
    SitetosystemlistComponent,
    CustomertositelistComponent,
    CallsummaryclasslistComponent,
    CallsummaryproblemsComponent,
    CallsummaryresolutionsComponent,
    CallsummarynextstepsComponent,
    CallsummaryaddComponent,
    CallsummaryComponent,
    SuggestedtopicsComponent,
    CriticalmessageComponent,
    SysteminfoComponent,
    SysteminfodetailComponent,
    RecentcustomersComponent,
    CurrentuserComponent,
    PartnerwindowComponent,
    ProfileeditComponent,
    CustomerratingbuttonComponent,
    CustomernotesdetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot(),
    NgxMaskModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token')
        }
      }
    })
  ],
  providers: [ValidateService, AuthService, AuthGuard, RouteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
