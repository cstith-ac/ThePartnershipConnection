import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/guards/auth.guard';
import { RegistrationGuard } from '../app/guards/registration.guard';
import { PartnerGuard } from '../app/guards/partner.guard';
import { EmployeeGuard } from '../app/guards/employee.guard';
import { AdminGuard } from './guards/admin.guard';
import { UnsavedchangesGuard } from './guards/unsavedchanges.guard';

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
import { CustomernotesdetailComponent } from './components/customernotesdetail/customernotesdetail.component';
import { CustomersysteminfoComponent } from './components/customersysteminfo/customersysteminfo.component';
import { CustomertositelistComponent } from './components/customertositelist/customertositelist.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PartnercontactlistComponent } from './components/partnercontactlist/partnercontactlist.component';
import { PartnerdashboardComponent } from './components/partnerdashboard/partnerdashboard.component';
import { PartnerinformationComponent } from './components/partnerinformation/partnerinformation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileeditComponent } from './components/profileedit/profileedit.component';
import { RecentcustomersComponent } from './components/recentcustomers/recentcustomers.component';
import { RegisterComponent } from './components/register/register.component';
import { SitetosystemlistComponent } from './components/sitetosystemlist/sitetosystemlist.component';
import { SuggestedtopicsComponent } from './components/suggestedtopics/suggestedtopics.component';
import { SysteminfoComponent } from './components/systeminfo/systeminfo.component';
import { SysteminfodetailComponent } from './components/systeminfodetail/systeminfodetail.component';
import { Customer3glistingComponent } from './components/customer3glisting/customer3glisting.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { ServiceviewComponent } from './components/serviceview/serviceview.component';
import { CollectionsviewComponent } from './components/collectionsview/collectionsview.component';
import { AdminComponent } from './components/admin/admin.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AdmineditComponent } from './components/adminedit/adminedit.component';
import { IncentiveentryComponent } from './components/incentiveentry/incentiveentry.component';
import { IncentivedashboardComponent } from './components/incentivedashboard/incentivedashboard.component';
import { IncentivenewcustomerComponent } from './components/incentivenewcustomer/incentivenewcustomer.component';
import { IncentivenewsiteComponent } from './components/incentivenewsite/incentivenewsite.component';
import { IncentiverecurringComponent } from './components/incentiverecurring/incentiverecurring.component';
import { IncentiveequipmatComponent } from './components/incentiveequipmat/incentiveequipmat.component';
import { IncentivelaborchargesComponent } from './components/incentivelaborcharges/incentivelaborcharges.component';
import { IncentiveDashboardTestComponent } from './components/incentive-dashboard-test/incentive-dashboard-test.component';
import { CalltoactionlistingComponent } from './components/calltoactionlisting/calltoactionlisting.component';
import { CancelqueuelistComponent } from './components/cancelqueuelist/cancelqueuelist.component';
import { PartnerinvoicelistingComponent } from './components/partnerinvoicelisting/partnerinvoicelisting.component';
import { TpcpartneragingreportComponent } from './components/tpcpartneragingreport/tpcpartneragingreport.component';
import { PartnerservicelistingComponent } from './components/partnerservicelisting/partnerservicelisting.component';
import { PartnerviewlistComponent } from './components/partnerviewlist/partnerviewlist.component';
import { AdminedituserComponent } from './components/adminedituser/adminedituser.component';
import { RmlistComponent } from './components/rmlist/rmlist.component';
import { RmlisteditComponent } from './components/rmlistedit/rmlistedit.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard, RegistrationGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, EmployeeGuard]
  },
  {
    path: 'partner-dashboard',
    component: PartnerdashboardComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-edit/:id',
    component: ProfileeditComponent,
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
  },
  {
    path: 'system-info/:id',
    component: SysteminfodetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'recent-customers',
    component: RecentcustomersComponent,
    canActivate: [AuthGuard, EmployeeGuard]
  },
  {
    path: 'customer-note/:id',
    component: CustomernotesdetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-3g-listing',
    component: Customer3glistingComponent,
    canActivate: [AuthGuard, PartnerGuard],
    //canDeactivate: [UnsavedchangesGuard]
  },
  {
    path: 'tpc-partner-aging-report',
    component: TpcpartneragingreportComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'call-to-action-listing',
    component: CalltoactionlistingComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'cancel-queue-list',
    component: CancelqueuelistComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'partner-invoice-listing',
    component: PartnerinvoicelistingComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'partner-service-list',
    component: PartnerservicelistingComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'incentive-entry',
    component: IncentiveentryComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'incentive-dashboard',
    component: IncentivedashboardComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'incentive-dashboard-test',
    component: IncentiveDashboardTestComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  // {
  //   path: 'customer-test',
  //   component: CustomerTestComponent,
  //   canActivate: [AuthGuard, PartnerGuard]
  // },
  {
    path: 'new-customer',
    component: IncentivenewcustomerComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'new-site',
    component: IncentivenewsiteComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'incentive-recurring',
    component: IncentiverecurringComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'incentive-equipment-materials',
    component: IncentiveequipmatComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'incentive-labor-charges',
    component: IncentivelaborchargesComponent,
    canActivate: [AuthGuard, PartnerGuard]
  },
  {
    path: 'service-view',
    component: ServiceviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'collections-view',
    component: CollectionsviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'partner-view-list',
    component: PartnerviewlistComponent,
    canActivate: [AuthGuard, EmployeeGuard]
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent //403 Forbidden -> Forbidden
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
    // canDeactivate: [UnsavedchangesGuard]
  },
  {
    path: 'admin-edit/:id',
    component: AdmineditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-edit-user/:id',
    component: AdminedituserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rmlist',
    component: RmlistComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'rmlist-edit/:id',
    component: RmlisteditComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '**',
    component: PagenotfoundComponent //404 Not Found -> PageNotFound
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
