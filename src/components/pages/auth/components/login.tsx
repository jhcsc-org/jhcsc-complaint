import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
		<div
			{...contentProps}
			className="flex justify-center items-center min-h-screen"
		>
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">
						{translate("pages.login.title", "Sign in to your account")}
					</CardTitle>
					<CardDescription>
						{translate(
							"pages.login.description",
							"Enter your email below to login to your account.",
						)}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{renderProviders()}
					{!hideForm && (
						<>
							<div className="grid gap-2">
								<Label htmlFor="email-input">
									{translate("pages.login.fields.email", "Email")}
								</Label>
								<Input
									id="email-input"
									name="email"
									type="text"
									size={20}
									autoCorrect="off"
									spellCheck={false}
									autoCapitalize="off"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password-input">
									{translate("pages.login.fields.password", "Password")}
								</Label>
								<Input
									id="password-input"
									type="password"
									name="password"
									required
									size={20}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							{rememberMe ?? (
								// biome-ignore lint/complexity/noUselessFragments: <explanation>
								<>
									<Label
										htmlFor="remember-me-input"
										className="flex items-center gap-2"
									>
										<Input
											id="remember-me-input"
											name="remember"
											type="checkbox"
											size={20}
											className="w-4 h-4"
											checked={remember}
											value={remember.toString()}
											onChange={() => {
												setRemember(!remember);
											}}
										/>
										{translate("pages.login.buttons.rememberMe", "Remember me")}
									</Label>
								</>
							)}

							<Link
								to={"/forgot-password"}
								className="ml-auto inline-block text-sm underline"
							>
								{forgotPasswordLink ??
									renderLink(
										"/forgot-password",
										translate(
											"pages.login.buttons.forgotPassword",
											"Forgot password?",
										),
									)}
							</Link>
						</>
					)}
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						onClick={() => login({ email, password, remember })}
					>
						{translate("pages.login.signin", "Sign in")}
					</Button>
				</CardFooter>
			</Card>
			{registerLink !== false && hideForm && (
				<div style={{ textAlign: "center" }}>
					{translate("pages.login.buttons.noAccount", "Don’t have an account?")}{" "}
					{renderLink(
						"/register",
						translate("pages.login.register", "Sign up"),
					)}
				</div>
			)}
		</div>
	);

	return (
		<div {...wrapperProps}>
			{renderContent ? renderContent(content, title) : content}
		</div>
	);
};
