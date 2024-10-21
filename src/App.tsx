import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { HeadlessInferencer } from "@refinedev/inferencer/headless";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import {
  BookCopyIcon,
  ScanSearchIcon,
  SendIcon,
  UsersIcon
} from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import authProvider from "./authProvider";
import { Layout } from "./components/layout";
import { AuthPage } from "./components/pages/auth";
import { Toaster } from "./components/ui/sonner";
import { FiledComplaints } from "./pages/admin/complains/list";
import { ComplainCreate } from "./pages/citizens/complains/create";
import { ComplainList } from "./pages/citizens/complains/list";
import { ComplainShow } from "./pages/citizens/complains/show";
import { BarangayCitizenList } from "./pages/lupon/citizens";
import BarangayFiledComplaints from "./pages/lupon/complains/list";
import { LuponComplainShow } from "./pages/lupon/complains/show";
import { LuponComplainList } from "./pages/lupon/list";
import DashboardReports from "./pages/lupon/report";
import { supabaseClient } from "./utility";

function App() {
  return (
    (<BrowserRouter>
      <Toaster richColors expand visibleToasts={3} />
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            dataProvider={dataProvider(supabaseClient)}
            liveProvider={liveProvider(supabaseClient)}
            authProvider={authProvider}
            routerProvider={routerBindings}
            resources={[{
              name: "complaints",
              list: "/",
              create: "/create",
              edit: "/edit/:id",
              show: "/show/:id",
              meta: {
                label: "Track Complaint",
                icon: <ScanSearchIcon className="w-5 h-5" />,
              },
            }, {
              name: "complaints",
              list: "/create",
              identifier: "complaint_id",
              meta: {
                label: "File Complaint",
                icon: <SendIcon className="w-5 h-5" />,
              },
            }, {
              name: "complaints",
              list: "/admin/manage",
              identifier: "admin_complaints",
              meta: {
                label: "Manage Complaints",
                icon: <BookCopyIcon className="w-5 h-5" />,
              },
            }, {
              name: "complaints",
              list: "/lupon/complaints",
              show: "/lupon/show/:id",
              identifier: "lupon_complaints",
              meta: {
                label: "Track Complaints",
                icon: <ScanSearchIcon className="w-5 h-5" />,
              },
            }, {
              name: "complaints",
              list: "/lupon/manage",
              identifier: "lupon_complaints_status",
              meta: {
                label: "Manage Complaints",
                icon: <BookCopyIcon className="w-5 h-5" />,
              },
            }, {
              name: "user_profile",
              list: "/lupon/citizens",
              identifier: "citizen_profile",
              meta: {
                label: "Barangay Citizens",
                icon: <UsersIcon className="w-5 h-5" />,
                idColumnName: "user_id",
              }
            }]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "ySPYms-OjD2aW-smWOMJ",
              liveMode: "auto",
            }}
          >
            <Routes>
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
                <Route path="/" element={<Outlet />}>
                  <Route index element={<ComplainList />} />
                  <Route path="create" element={<ComplainCreate />} />
                  <Route path="edit/:id" element={<HeadlessInferencer />} />
                  <Route path="show/:id" element={<ComplainShow />} />
                </Route>
                <Route path="/admin/manage" element={<Outlet />}>
                  <Route index element={<FiledComplaints />} />
                  <Route path="show/:id" element={<ComplainShow />} />
                </Route>
                <Route path="/lupon/complaints" element={<Outlet />}>
                  <Route index element={<LuponComplainList />} />
                </Route>
                <Route path="lupon/show/:id" element={<LuponComplainShow />} />
                <Route path="/lupon/manage" element={<Outlet />}>
                  <Route index element={<BarangayFiledComplaints />} />
                  <Route path="show/:id" element={<ComplainShow />} />
                </Route>
                <Route path="/lupon/citizens" element={<BarangayCitizenList />} />
                <Route path="reports" element={<DashboardReports/>}/>
                <Route path="*" element={<ErrorComponent />} />
              </Route>
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

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>)
  );
}

export default App;