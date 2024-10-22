import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

// Refine and related providers
import {
  Authenticated,
  ErrorComponent,
  Refine,
} from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { HeadlessInferencer } from "@refinedev/inferencer/headless";
import {
  RefineKbar,
  RefineKbarProvider,
} from "@refinedev/kbar";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";

// Icons
import {
  BellIcon,
  BookCopyIcon,
  LineChartIcon,
  ScanSearchIcon,
  SendIcon,
  UserIcon,
  Users2Icon,
  UsersIcon,
} from "lucide-react";

// Custom Components
import "./App.css";
import authProvider from "./authProvider";
import { Layout } from "./components/layout";
import { AuthPage } from "./components/pages/auth";
import { Toaster } from "./components/ui/sonner";

// Admin Pages
import { FiledComplaints } from "./pages/admin/complains/list";
import { AdminAddLupon } from "./pages/admin/manage-lupon/add-lupon";
import { ManageLuponList } from "./pages/admin/user_profiles";
import { ManageLuponEdit } from "./pages/admin/user_profiles/edit";

// Citizen Pages
import { ComplainCreate } from "./pages/citizens/complains/create";
import { ComplainList } from "./pages/citizens/complains/list";
import { ComplainShow } from "./pages/citizens/complains/show";
import { CitizenNotificationView } from "./pages/citizens/notifications";

// Lupon Pages
import { BarangayCitizenList } from "./pages/lupon/citizens";
import BarangayFiledComplaints from "./pages/lupon/complains/list";
import { LuponComplainShow } from "./pages/lupon/complains/show";
import { LuponComplainList } from "./pages/lupon/list";
import DashboardReports from "./pages/lupon/report";

// Utilities
import { notificationProvider } from "./providers/notificationProviders";
import { supabaseClient } from "./utility";

// Resource Configuration
const resources = [
  {
    name: "citizen_notifications_view",
    list: "/updates",
    meta: {
      label: "Recent Updates",
      icon: <BellIcon className="w-5 h-5" />,
    },
  },
  {
    name: "complaints",
    list: "/",
    create: "/create",
    show: "/show/:id",
    meta: {
      label: "My Complaints",
      icon: <ScanSearchIcon className="w-5 h-5" />,
    },
  },
  {
    name: "complaints",
    list: "/create",
    identifier: "complaint_id",
    meta: {
      label: "File Complaint",
      icon: <SendIcon className="w-5 h-5" />,
    },
  },
  {
    name: "complaints",
    list: "/admin/manage",
    identifier: "admin_complaints",
    meta: {
      label: "Manage Complaints",
      icon: <BookCopyIcon className="w-5 h-5" />,
    },
  },
  {
    name: "complaints",
    list: "/lupon/complaints",
    show: "/lupon/show/:id",
    identifier: "lupon_complaints",
    meta: {
      label: "Track Complaints",
      icon: <ScanSearchIcon className="w-5 h-5" />,
    },
  },
  {
    name: "complaints",
    list: "/lupon/manage",
    identifier: "lupon_complaints_status",
    meta: {
      label: "Manage Complaints",
      icon: <BookCopyIcon className="w-5 h-5" />,
    },
  },
  {
    name: "user_profile",
    list: "/lupon/citizens",
    identifier: "citizen_profile",
    meta: {
      label: "Barangay Citizens",
      icon: <UsersIcon className="w-5 h-5" />,
      idColumnName: "user_id",
    },
  },
  {
    name: "reports",
    list: "/lupon/reports",
    meta: {
      label: "Barangay Report",
      icon: <LineChartIcon className="w-5 h-5" />,
    },
  },
  {
    name: "users",
    edit: "/admin/manage/lupons/edit/:id",
    meta: {
      hide: true,
      idColumnName: "user_id",
    },
  },
  {
    name: "add",
    list: "/admin/manage/lupons/add",
    meta: {
      label: "Register Lupon",
      icon: <UserIcon className="w-5 h-5" />,
    }
  },
  {
    name: "user_profile",
    list: "/admin/manage/lupons",
    create: "/admin/manage/lupons/add",
    show: "/admin/manage/lupons",
    identifier: "admin_lupons",
    meta: {
      label: "Manage Lupons",
      icon: <Users2Icon className="w-5 h-5" />,
      idColumnName: "user_id",
    },
  },
];

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors expand visibleToasts={3} />
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            dataProvider={dataProvider(supabaseClient)}
            liveProvider={liveProvider(supabaseClient)}
            notificationProvider={notificationProvider}
            authProvider={authProvider}
            routerProvider={routerBindings}
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "ySPYms-OjD2aW-smWOMJ",
              liveMode: "auto",
            }}
            onLiveEvent={(event) => {
              console.log(event);
            }}
          >
            <Routes>
              {/* Authenticated Routes */}
              <Route
                element={
                  <Authenticated
                    key="authenticated-inner"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                {/* Main Complaints Routes */}
                <Route path="/" element={<Outlet />}>
                  <Route index element={<ComplainList />} />
                  <Route path="create" element={<ComplainCreate />} />
                  <Route path="edit/:id" element={<HeadlessInferencer />} />
                  <Route path="show/:id" element={<ComplainShow />} />
                </Route>

                {/* Updates */}
                <Route path="/updates" element={<CitizenNotificationView />} />

                {/* Admin Manage Routes */}
                <Route path="/admin/manage" element={<Outlet />}>
                  <Route index element={<FiledComplaints />} />
                  <Route path="show/:id" element={<ComplainShow />} />
                  <Route path="lupons" element={<Outlet />}>
                    <Route index element={<ManageLuponList />} />
                    <Route path="add" element={<AdminAddLupon />} />
                    <Route path="edit/:id" element={<ManageLuponEdit />} />
                  </Route>
                </Route>

                {/* Lupon Complaints Routes */}
                <Route path="/lupon/complaints" element={<Outlet />}>
                  <Route index element={<LuponComplainList />} />
                </Route>
                <Route path="lupon/show/:id" element={<LuponComplainShow />} />

                {/* Lupon Manage Routes */}
                <Route path="/lupon/manage" element={<Outlet />}>
                  <Route index element={<BarangayFiledComplaints />} />
                  <Route path="show/:id" element={<ComplainShow />} />
                </Route>

                {/* Citizens and Reports */}
                <Route path="/lupon/citizens" element={<BarangayCitizenList />} />
                <Route path="/lupon/reports" element={<DashboardReports />} />

                {/* Fallback */}
                <Route path="*" element={<ErrorComponent />} />
              </Route>

              {/* Authentication Routes */}
              <Route
                element={
                  <Authenticated
                    key="authenticated-outer"
                    fallback={<Outlet />}
                  >
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      renderContent={(content) => <div>{content}</div>}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={<AuthPage type="register" />}
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
              </Route>
            </Routes>

            {/* Refine Providers */}
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
