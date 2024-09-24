import {
  Authenticated,
  ErrorComponent,
  Refine
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { HeadlessInferencer } from "@refinedev/inferencer/headless";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import authProvider from "./authProvider";
import { Layout } from "./components/layout";
import { AuthPage } from "./components/pages/auth";
import { supabaseClient } from "./utility";

function App() {
	return (
		<BrowserRouter>
			<RefineKbarProvider>
				<DevtoolsProvider>
					<Refine
						dataProvider={dataProvider(supabaseClient)}
						liveProvider={liveProvider(supabaseClient)}
						authProvider={authProvider}
						routerProvider={routerBindings}
						resources={[
							{
								name: "barangays",
								list: "/barangays",
								create: "/barangays/create",
								edit: "/barangays/edit/:id",
								show: "/barangays/show/:id",
							},
							{
								name: "lupon_members",
								list: "/lupon_members",
								create: "/lupon_members/create",
								edit: "/lupon_members/edit/:id",
								show: "/lupon_members/show/:id",
							},
							{
								name: "people",
								list: "/people",
								create: "/people/create",
								edit: "/people/edit/:id",
								show: "/people/show/:id",
							},
							{
								name: "citizens",
								list: "/citizens",
								create: "/citizens/create",
								edit: "/citizens/edit/:id",
								show: "/citizens/show/:id",
							},
							{
								name: "citizen_profiles",
								list: "/citizen_profiles",
								create: "/citizen_profiles/create",
								edit: "/citizen_profiles/edit/:id",
								show: "/citizen_profiles/show/:id",
							},
							{
								name: "complaints",
								list: "/complaints",
								create: "/complaints/create",
								edit: "/complaints/edit/:id",
								show: "/complaints/show/:id",
							},
							{
								name: "complaint_participants",
								list: "/complaint_participants",
								create: "/complaint_participants/create",
								edit: "/complaint_participants/edit/:id",
								show: "/complaint_participants/show/:id",
							},
							{
								name: "complaint_history",
								list: "/complaint_history",
								create: "/complaint_history/create",
								edit: "/complaint_history/edit/:id",
								show: "/complaint_history/show/:id",
							},
							{
								name: "complaint_documents",
								list: "/complaint_documents",
								create: "/complaint_documents/create",
								edit: "/complaint_documents/edit/:id",
								show: "/complaint_documents/show/:id",
							},
						]}
						options={{
							syncWithLocation: true,
							warnWhenUnsavedChanges: true,
							useNewQueryKeys: true,
							projectId: "ySPYms-OjD2aW-smWOMJ",
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
								<Route
									index
									element={<NavigateToResource resource="barangays" />}
								/>
								<Route path="/barangays">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/lupon_members">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/people">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/citizens">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/citizen_profiles">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/complaints">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/complaint_participants">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/complaint_history">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/complaint_documents">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/user_roles">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
								<Route path="/users">
									<Route index element={<HeadlessInferencer />} />
									<Route path="create" element={<HeadlessInferencer />} />
									<Route path="edit/:id" element={<HeadlessInferencer />} />
									<Route path="show/:id" element={<HeadlessInferencer />} />
								</Route>
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
											renderContent={(content) => (
												<div>
													<p
														style={{
															padding: 10,
															color: "#004085",
															backgroundColor: "#cce5ff",
															borderColor: "#b8daff",
															textAlign: "center",
														}}
													>
														email: info@refine.dev
														<br /> password: refine-supabase
													</p>
													{content}
												</div>
											)}
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
					<DevtoolsPanel />
				</DevtoolsProvider>
			</RefineKbarProvider>
		</BrowserRouter>
	);
}

export default App;
