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
import { FileTextIcon } from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import authProvider from "./authProvider";
import { Layout } from "./components/layout";
import { AuthPage } from "./components/pages/auth";
import { Toaster } from "./components/ui/sonner";
import { ComplainCreate } from "./pages/citizens/complains/create";
import { ComplainList } from "./pages/citizens/complains/list";
import { supabaseClient } from "./utility";

function App() {
	return (
		<BrowserRouter>
			<Toaster expand visibleToasts={3} />
			<RefineKbarProvider>
				<DevtoolsProvider>
					<Refine
						dataProvider={dataProvider(supabaseClient)}
						liveProvider={liveProvider(supabaseClient)}
						authProvider={authProvider}
						routerProvider={routerBindings}
						resources={[
							{
								name: "complaints",
								list: "/complaints",
								create: "/complaints/create",
								edit: "/complaints/edit/:id",
								show: "/complaints/show/:id",
								meta: {
									label: "Complain",
									icon: <FileTextIcon className="w-5 h-5" />
								},
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
									element={<NavigateToResource resource="complaints" />}
								/>
								<Route path="/complaints">
									<Route index element={<ComplainList />} />
									<Route path="create" element={<ComplainCreate />} />
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
