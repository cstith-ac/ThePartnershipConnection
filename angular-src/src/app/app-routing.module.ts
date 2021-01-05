import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/guards/auth.guard';
import { CallsummaryComponent } from './components/callsummary/callsummary.component';
import { CallsummaryaddComponent } from './components/callsummaryadd/callsummaryadd.component';
import { CallsummaryclasslistComponent } from './components/callsummaryclasslist/callsummaryclasslist.component';
import { CallsummarynextstepsComponent } from './components/callsummarynextsteps/callsummarynextsteps.component';
import { CallsummaryproblemsComponent } from './components/callsummaryproblems/callsummaryproblems.component';
import { CallsummaryresolutionsComponent } from './components/callsummaryresolutions/callsummaryresolutions.component';
import { CcassistantSystemsComponent } from './components/ccassistant-systems/ccassistant-systems.component';
import { CriticalmessageComponent } from './components/criticalmessage/criticalmessage.component';
import { CustomeraccesslistComponent } from './components/customeraccesslist/customeraccesslist.component';
import { CustomercaredashboardinfoComponent } from './components/customercaredashboardinfo/customercaredashboardinfo.component';
import { CustomersysteminfoComponent } from './components/customersysteminfo/customersysteminfo.component';
import { CustomertositelistComponent } from './components/customertositelist/customertositelist.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PartnercontactlistComponent } from './components/partnercontactlist/partnercontactlist.component';
import { PartnerinformationComponent } from './components/partnerinformation/partnerinformation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { SitetosystemlistComponent } from './components/sitetosystemlist/sitetosystemlist.component';
import { SuggestedtopicsComponent } from './components/suggestedtopics/suggestedtopics.component';
import { SysteminfoComponent } from './components/systeminfo/systeminfo.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-access-list',
    component: CustomeraccesslistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-care-dashboard-info',
    component: CustomercaredashboardinfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-system-info',
    component: CustomersysteminfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cc-assistant-systems',
    component: CcassistantSystemsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'partner-contact-list',
    component: PartnercontactlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'partner-information',
    component: PartnerinformationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'site-to-system-list',
    component: SitetosystemlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-to-site-list',
    component: CustomertositelistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'call-summary-class-list',
    component: CallsummaryclasslistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'call-summary-problems',
    component: CallsummaryproblemsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'call-summary-resolutions',
    component: CallsummaryresolutionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'call-summary-next-steps',
    component: CallsummarynextstepsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'call-summary-add',
    component: CallsummaryaddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'call-summary',
    component: CallsummaryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'suggested-topics',
    component: SuggestedtopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'critical-message',
    component: CriticalmessageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'system-info',
    component: SysteminfoComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
