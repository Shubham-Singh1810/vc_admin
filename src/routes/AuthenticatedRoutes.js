import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import NotFound from "../pages/Unauthorized/NotFound";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

// Layout
import AuthenticatedLayout from "../Layout/AuthenticatedLayout";

// Dashboard
import Dashboard from "../pages/Dashboard/Dashboard";
import Analytics from "../pages/Dashboard/Analytics";


// User Management
import AllUsers from "../pages/UserManagement/AllUsers";
import ActiveUsers from "../pages/UserManagement/ActiveUsers";
import VerifiedUsers from "../pages/UserManagement/VerifiedUsers";
import NewlyRegisteredUsers from "../pages/UserManagement/NewlyRegisteredUsers";
import BlockedUsers from "../pages/UserManagement/BlockedUsers";
import BalanceUsers from "../pages/UserManagement/BalanceUsers";
import ActiveLoanUsers from "../pages/UserManagement/ActiveLoanUsers";
import CreateUser from "../pages/UserManagement/CreateUser";
import UserDetails from "../pages/UserManagement/UserDetails";
import UserEmployementDetails from "../pages/UserManagement/UserEmployementDetails";
import UserDocuments from "../pages/UserManagement/UserDocuments";
import UserLoanHistory from "../pages/UserManagement/UserLoanHistory";
import UserEmis from "../pages/UserManagement/UserEmis";
import UserTransectionHistory from "../pages/UserManagement/UserTransectionHistory";


// Fund Management
import DepositList from "../pages/FundManagement/DepositList";
import WithdrawList from "../pages/FundManagement/WithdrawList";

// Policy
import TermsAndCondition from "../pages/Policy/TermsAndCondition";
import PrivacyPolicy from "../pages/Policy/PrivacyPolicy";
import CookieePolicy from "../pages/Policy/CookieePolicy";

// Notification
import Notify from "../pages/BroadcastManagement/Notify";

// Support Management
import ContactQueryList from "../pages/SupportManagement/ContactQueryList";
import FaqList from "../pages/SupportManagement/FaqList";

// Tickets
import AllTicket from "../pages/Ticket/AllTicket";
import ClosedTicket from "../pages/Ticket/ClosedTicket";
import OpenTicket from "../pages/Ticket/OpenTicket";
import TicketCategories from "../pages/Ticket/TicketCategories";
import ChatBox from "../pages/Ticket/ChatBox";

// Branch Management
import Branches from "../pages/BranchManagement/Branches";
import ViewStaff from "../pages/BranchManagement/ViewStaff";

// Role & Admin
import AssignRole from "../pages/RoleManagement/AssignRole";
import RoleList from "../pages/RoleManagement/RoleList";
import UpdateRole from "../pages/RoleManagement/UpdateRole";
import AdminList from "../pages/AdminManagement/AdminList";

// Profile
import Profile from "../pages/MyProfile/Profile";
import Permissions from "../pages/MyProfile/Permissions";

// Documents
import Documents from "../pages/Documents/Documents";
import UpdateUser from "../pages/UserManagement/UpdateUser";
import LoanPurpose from "../pages/SupportManagement/LoanPurpose";
import PaydayLoanApplication from "../pages/PaydayLoanManagement/PaydayLoanApplicationList";
import UpdateLoanRequirement from "../pages/PayDayLoanType/UpdateLoanRequirement";
import SystemConfigration from "../pages/SystemManagement/SystemConfigration";
import CreatePayDayApplication from "../pages/PaydayLoanManagement/CreatePayDayApplication";
import UpdatePayDayApplication from "../pages/PaydayLoanManagement/UpdatePayDayApplication";
import PaydayLoanDetails from "../pages/PaydayLoanManagement/PaydayLoanDetails";
import NotificationSettings from "../pages/BroadcastManagement/NotificationSettings";
import ScheduleRemainders from "../pages/BroadcastManagement/ScheduleRemainders";
import SystemNotification from "../pages/BroadcastManagement/SystemNotification";
import Categories from "../pages/ContentManagement/Categories";
import Subcategories from "../pages/ContentManagement/Subcategories";
import AllBatch from "../pages/BatchManagement/AllBatch";
import CompletedBatch from "../pages/BatchManagement/CompletedBatch";
import UpcomingBatch from "../pages/BatchManagement/UpcomingBatch";
import OngoingBatch from "../pages/BatchManagement/OngoingBatch";
import CreateBatch from "../pages/BatchManagement/CreateBatch";
import InstructorList from "../pages/InstructorManagement/InstructorList";
import UpdateBatch from "../pages/BatchManagement/UpdateBatch";
import CouponList from "../pages/CouponManagement/CouponList";
import Booking from "../pages/BookingManagement/Booking";
import BulkBooking from "../pages/BookingManagement/BulkBooking";
import EnquiryList from "../pages/SupportManagement/EnquiryList";
import BatchDetails from "../pages/BatchManagement/BatchDetails";
import CreateTopic from "../pages/BatchManagement/CreateTopic";
import UpdateTopic from "../pages/BatchManagement/UpdateTopic";
import Banner from "../pages/ContentManagement/Banner";
import CourseList from "../pages/CourseManagement/CourseList";
import CreateCourse from "../pages/CourseManagement/CreateCourse";
import CourseDetails from "../pages/CourseManagement/CourseDetails";
import CreateCourseTopic from "../pages/CourseManagement/CreateCourseTopic";
import UpdateCourseTopic from "../pages/CourseManagement/UpdateCourseTopic";
import UpdateCourse from "../pages/CourseManagement/UpdateCourse";

function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route element={<AuthenticatedLayout />}>
        {/* Dashboard */}
        <Route
          element={<ProtectedRoute allowedPermissions={["Dashboard-View"]} />}
        >
          <Route path="/" element={<Dashboard />} />
        </Route>

        {/* Analytics */}
        <Route
          element={<ProtectedRoute allowedPermissions={["Analytics-View"]} />}
        >
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* Branch Management */}
        <Route
          element={<ProtectedRoute allowedPermissions={["Branches-View"]} />}
        >
          <Route path="/branches" element={<Branches />} />
          <Route path="/view-staff/:id" element={<ViewStaff />} />
          
        </Route>

        {/* Staff Management */}
        <Route
          element={<ProtectedRoute allowedPermissions={["Staff/Agent-View"]} />}
        >
          <Route path="/agent-list" element={<AdminList />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedPermissions={["Instructors-View"]} />}
        >
          <Route path="/instructor-list" element={<InstructorList />} />
        </Route>

        {/* User Management */}
        <Route element={<ProtectedRoute allowedPermissions={["Users-View"]} />}>
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/active-users" element={<ActiveUsers />} />
          <Route path="/verified-users" element={<VerifiedUsers />} />
          <Route
            path="/newly-registered-users"
            element={<NewlyRegisteredUsers />}
          />
          <Route path="/active-loan-users" element={<ActiveLoanUsers />} />
          <Route path="/users-with-balance" element={<BalanceUsers />} />
          <Route path="/blocked-users" element={<BlockedUsers />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedPermissions={["Users-Create"]} />}
        >
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/update-user/:id" element={<UpdateUser />} />
        </Route>
        <Route element={<ProtectedRoute allowedPermissions={["Users-Edit"]} />}>
          <Route path="/user-details/:id" element={<UserDetails />} />
          <Route
            path="/user-employemt-details/:id"
            element={<UserEmployementDetails />}
          />
          <Route path="/user-documents/:id" element={<UserDocuments />} />
          <Route path="/user-loan-history/:id" element={<UserLoanHistory />} />
          <Route path="/user-emis/:id" element={<UserEmis />} />
          <Route
            path="/user-transection-history/:id"
            element={<UserTransectionHistory />}
          />
        </Route>

        
        <Route
          element={<ProtectedRoute allowedPermissions={["Categories-View"]} />}
        >
          <Route path="/categories" element={<Categories />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedPermissions={["Subcategories-View"]} />
          }
        >
          <Route path="/subcategories" element={<Subcategories />} />
        </Route>
         <Route
          element={
            <ProtectedRoute allowedPermissions={["Subcategories-View"]} />
          }
        >
          <Route path="/banners" element={<Banner />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedPermissions={["Subcategories-View"]} />
          }
        >
          <Route path="/all-batches" element={<AllBatch />} />
          <Route path="/ongoing-batches" element={<OngoingBatch />} />
          <Route path="/upcoming-batches" element={<UpcomingBatch />} />
          <Route path="/completed-batches" element={<CompletedBatch />} />
          <Route path="/create-batch" element={<CreateBatch />} />
          <Route path="/update-batch/:id" element={<UpdateBatch />} />
          <Route path="/batch/:id" element={<BatchDetails />} />
          <Route path="/create-topic/:id" element={<CreateTopic />} />
          <Route path="/update-topic/:id" element={<UpdateTopic />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedPermissions={["Subcategories-View"]} />
          }
        >
          <Route path="/courses" element={<CourseList />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/course-details/:id" element={<CourseDetails />} />
          <Route path="/create-course-topic/:id" element={<CreateCourseTopic />} />
          <Route path="/update-course-topic/:id" element={<UpdateCourseTopic />} />
          <Route path="/update-course/:id" element={<UpdateCourse />} />
          
        </Route>

        {/* Fund Management */}
        <Route element={<ProtectedRoute allowedPermissions={["Funds-View"]} />}>
          <Route path="/deposit-list" element={<DepositList />} />
          <Route path="/withdraw-list" element={<WithdrawList />} />
        </Route>

        {/* Loan Type Management */}
       

        
        {/* System configration */}
        <Route
          element={
            <ProtectedRoute allowedPermissions={["System Configration-View"]} />
          }
        >
          <Route path="/system-configration" element={<SystemConfigration />} />
        </Route>

        {/* Policies & System */}
        <Route path="/terms-condition" element={<TermsAndCondition />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/Cookiee-policy" element={<CookieePolicy />} />
        <Route path="/notify" element={<Notify />} />

        {/* Document */}
        <Route
          element={<ProtectedRoute allowedPermissions={["Documents-View"]} />}
        >
          <Route path="/documents" element={<Documents />} />
        </Route>

        {/* loan purpose */}
        <Route
          element={<ProtectedRoute allowedPermissions={["Documents-View"]} />}
        >
          <Route path="/loan-purpose" element={<LoanPurpose />} />
        </Route>
        {/* Contact */}
        <Route
          element={
            <ProtectedRoute allowedPermissions={["Contact Queries-View"]} />
          }
        >
          <Route path="/contact-queries" element={<ContactQueryList />} />
          <Route path="/enquires" element={<EnquiryList />} />
        </Route>

        {/* Tickets */}
        <Route
          element={<ProtectedRoute allowedPermissions={["All Ticket-View"]} />}
        >
          <Route path="/all-tickets" element={<AllTicket />} />
          <Route path="/ticket-categories" element={<TicketCategories />} />
          <Route path="/opened-tickets" element={<OpenTicket />} />
          <Route path="/closed-tickets" element={<ClosedTicket />} />
          <Route path="/chat-details/:id" element={<ChatBox />} />
        </Route>

        {/* faq */}
        <Route element={<ProtectedRoute allowedPermissions={["FAQ'S-View"]} />}>
          <Route path="/faq-list" element={<FaqList />} />
        </Route>
         <Route element={<ProtectedRoute allowedPermissions={["FAQ'S-View"]} />}>
          <Route path="/coupon-list" element={<CouponList />} />
        </Route>
         <Route element={<ProtectedRoute allowedPermissions={["FAQ'S-View"]} />}>
          <Route path="/booking-list" element={<Booking />} />
          <Route path="/bulk-booking-list" element={<BulkBooking />} />
        </Route>
        {/* Admin & Role Management */}
        <Route element={<ProtectedRoute allowedPermissions={["Roles-View"]} />}>
          <Route path="/role-list" element={<RoleList />} />
          <Route path="/assign-role" element={<AssignRole />} />
          <Route path="/update-role/:id" element={<UpdateRole />} />
        </Route>

        <Route element={<ProtectedRoute allowedPermissions={["Roles-View"]} />}>
          <Route
            path="/notification-settings"
            element={<NotificationSettings />}
          />
          <Route path="/notify" element={<Notify />} />
          <Route path="/schedule-remainders" element={<ScheduleRemainders />} />
          <Route path="/system-notification" element={<SystemNotification />} />
        </Route>

        {/* Profile */}
        <Route path="/my-profile" element={<Profile />} />
        <Route path="/permissions" element={<Permissions />} />
        <Route
          path="/create-payday-loan"
          element={<CreatePayDayApplication />}
        />
        <Route
          path="/update-payday-loan/:id"
          element={<UpdatePayDayApplication />}
        />
        <Route
          path="/payday-loan-details/:id"
          element={<PaydayLoanDetails />}
        />
      </Route>

      {/* Unauthorized & 404 */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AuthenticatedRoutes;
