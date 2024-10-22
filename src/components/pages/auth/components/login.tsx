import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	LoginFormTypes,
	LoginPageProps,
	useActiveAuthProvider,
	useLink,
	useLogin,
	useRouterContext,
	useRouterType,
	useTranslate,
} from "@refinedev/core";
import { motion } from "framer-motion";
import React, { useState } from "react";

type DivPropsType = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;
type FormPropsType = React.DetailedHTMLProps<
	React.FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;

type LoginProps = LoginPageProps<DivPropsType, DivPropsType, FormPropsType>;

export const LoginPage: React.FC<LoginProps> = ({
	providers,
	registerLink,
	forgotPasswordLink,
	rememberMe,
	contentProps,
	wrapperProps,
	renderContent,
	formProps,
	title = undefined,
	hideForm,
}) => {
	const routerType = useRouterType();
	const Link = useLink();
	const { Link: LegacyLink } = useRouterContext();

	const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);

	const translate = useTranslate();

	const authProvider = useActiveAuthProvider();
	const { mutate: login } = useLogin<LoginFormTypes>({
		v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
	});

	const renderLink = (link: string, text?: string) => {
		return <ActiveLink to={link}>{text}</ActiveLink>;
	};

	const renderProviders = () => {
		if (providers) {
			return providers.map((provider) => (
				<div
					key={provider.name}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: "1rem",
					}}
				>
					<Button
						onClick={() =>
							login({
								providerName: provider.name,
							})
						}
					>
						{provider?.icon}
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						{provider.label ?? <label>{provider.label}</label>}
					</Button>
				</div>
			));
		}
		return null;
	};

	const content = (
		// @ts-ignore
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
			{...contentProps}
			className="flex items-center justify-center min-h-screen p-4"
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
				className="w-full max-w-md"
			>
				<Card>
					<CardHeader className="space-y-1">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
						>
							<CardTitle className="text-2xl font-bold">
								{translate("pages.login.title", "Maayong Pagbalik!")}
							</CardTitle>
							<p className="text-sm text-gray-500">
								{translate("pages.login.description", "Good to see you again!")}
							</p>
						</motion.div>
					</CardHeader>
					<CardContent className="space-y-4">
						{renderProviders()}
						{!hideForm && (
							<motion.form
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
								onSubmit={(e) => { e.preventDefault(); login({ email, password, remember }); }}
							>
								<div className="space-y-4">
									<div>
										<Label htmlFor="email-input">
											{translate("pages.login.fields.email", "Email address")}
										</Label>
										<Input
											id="email-input"
											name="email"
											type="email"
											placeholder="account@jhcsc.edu.ph"
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="mt-1"
										/>
									</div>
									<div>
										<div className="flex items-center justify-between">
											<Label htmlFor="password-input">
												{translate("pages.login.fields.password", "Password")}
											</Label>
											<Link
												to="/forgot-password"
												className="text-sm hover:underline"
											>
												{translate("pages.login.buttons.forgotPassword", "Forgot password?")}
											</Link>
										</div>
										<Input
											id="password-input"
											type="password"
											name="password"
											required
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="mt-1"
										/>
									</div>
									<Button type="submit" className="w-full">
										{translate("pages.login.signin", "Sign in")}
									</Button>
								</div>
							</motion.form>
						)}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4, delay: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
							className="text-sm text-center"
						>
							{registerLink ?? (
								<p>
									{translate("pages.login.buttons.noAccount", "Don't have an account?")}{" "}
									<Link to="/register" className="hover:underline">
										{translate("pages.login.register", "Or sign up")}
									</Link>
								</p>
							)}
						</motion.div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	);

	return (
		<div {...wrapperProps} className="min-h-screen">
			{renderContent ? renderContent(content, title) : content}
		</div>
	);
};
