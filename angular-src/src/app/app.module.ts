import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AvatarModule } from 'ngx-avatar'; 
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from '../app/guards/auth.guard';
import { AdminGuard } from '../app/guards/admin.guard';
import { EmployeeGuard } from '../app/guards/employee.guard';
import { UnsavedchangesGuard } from './guards/unsavedchanges.guard';
// import { NgxMaskModule } from 'ngx-mask';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { NgxPaginationModule } from 'ngx-pagination';
import { PhonePipe } from './_helpers/phone.pipe';
import { SortPipe } from './_helpers/sort.pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FilterPipe } from './_helpers/filter.pipe';
import { ListFilterPipe } from './_helpers/listFilterPipe';
import { Filter90DayPipe } from './_helpers/filter90-day.pipe';
import { PointerStyleDirective } from './_helpers/pointer-style.directive';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CommonModule, CurrencyPipe} from '@angular/common';

import { ValidateService } from '../app/services/validate.service';
import { AuthService } from '../app/services/auth.service';
import { IncentiveEntryService } from '../app/services/incentive-entry.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';

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
import { PartnerdashboardComponent } from './components/partnerdashboard/partnerdashboard.component';
import { Customer3glistingComponent } from './components/customer3glisting/customer3glisting.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { ServiceviewComponent } from './components/serviceview/serviceview.component';
import { CollectionsviewComponent } from './components/collectionsview/collectionsview.component';
import { NavlistComponent } from './components/navlist/navlist.component';
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
import { FilterSitePipe } from './_helpers/filter-site.pipe';
import { FilterCentralStationPipe } from './_helpers/filter-central-station.pipe';
import { IncentiveDashboardTestComponent } from './components/incentive-dashboard-test/incentive-dashboard-test.component';
import { CalltoactionlistingComponent } from './components/calltoactionlisting/calltoactionlisting.component';
import { CancelqueuelistComponent } from './components/cancelqueuelist/cancelqueuelist.component';
import { PartnerinvoicelistingComponent } from './components/partnerinvoicelisting/partnerinvoicelisting.component';
import { TpcpartneragingreportComponent } from './components/tpcpartneragingreport/tpcpartneragingreport.component';
import { PartnerservicelistingComponent } from './components/partnerservicelisting/partnerservicelisting.component';
import { RemovewhitespacesPipe } from './_helpers/removewhitespaces.pipe';

// import { CustomerTestComponent } from './components/customer-test/customer-test.component';
// import {AutocompleteLibModule} from 'angular-ng-autocomplete';

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
    CustomernotesdetailComponent,
    PartnerdashboardComponent,
    Customer3glistingComponent,
    ForbiddenComponent,
    ServiceviewComponent,
    CollectionsviewComponent,
    NavlistComponent,
    AdminComponent,
    PagenotfoundComponent,
    PhonePipe,
    SortPipe,
    FilterPipe,
    AdmineditComponent,
    IncentiveentryComponent,
    IncentivedashboardComponent,
    IncentivenewcustomerComponent,
    IncentivenewsiteComponent,
    IncentiverecurringComponent,
    IncentiveequipmatComponent,
    IncentivelaborchargesComponent,
    PointerStyleDirective,
    FilterSitePipe,
    Filter90DayPipe,
    FilterCentralStationPipe,
    IncentiveDashboardTestComponent,
    ListFilterPipe,
    CalltoactionlistingComponent,
    CancelqueuelistComponent,
    PartnerinvoicelistingComponent,
    TpcpartneragingreportComponent,
    PartnerservicelistingComponent,
    RemovewhitespacesPipe
    //CustomerTestComponent
  ],
  imports: [
    DropDownsModule,
    LabelModule,
    InputsModule,
    ButtonsModule,
    CommonModule,
    FilterPipeModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FlashMessagesModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxPaginationModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token')
        }
      }
    }),
    NgbModule,
    GridModule,
    ExcelModule,
    AutocompleteLibModule,
    AvatarModule
  ],
  providers: [ValidateService, AuthService, IncentiveEntryService, AuthGuard, AdminGuard, EmployeeGuard, UnsavedchangesGuard, RouteService, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
