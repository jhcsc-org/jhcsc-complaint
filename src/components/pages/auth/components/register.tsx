import {
  RegisterPageProps,
  useActiveAuthProvider,
  useLink,
  useRegister,
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

type RegisterProps = RegisterPageProps<
	DivPropsType,
	DivPropsType,
	FormPropsType
>;

export const RegisterPage: React.FC<RegisterProps> = ({
	providers,
	loginLink,
	wrapperProps,
	contentProps,
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
	const [fullName, setFullName] = useState("");
	const [purok, setPurok] = useState("");
	const [street, setStreet] = useState("");
	const [blockNumber, setBlockNumber] = useState("");
	const [houseNumber, setHouseNumber] = useState("");

	const translate = useTranslate();

	const authProvider = useActiveAuthProvider();
	const { mutate: register, isLoading } = useRegister({
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
					{/* biome-ignore lint/a11y/useButtonType: this is fine */}
					<button
						onClick={() =>
							register({
								providerName: provider.name,
							})
						}
						style={{
							display: "flex",
							alignItems: "center",
						}}
					>
						{provider?.icon}
						{/* biome-ignore lint/a11y/noLabelWithoutControl: this is fine */}
						{provider.label ?? <label>{provider.label}</label>}
					</button>
				</div>
			));
		}
		return null;
	};

  console.log({
    email,
    password,
    fullName,
    purok,
    street,
    blockNumber,
    houseNumber,  
  })

	const content = (
		<div {...contentProps}>
			<h1 style={{ textAlign: "center" }}>
				{translate("pages.register.title", "Sign up for your account")}
			</h1>
			{renderProviders()}
			{!hideForm && (
				<>
					<hr />
					<form
						onSubmit={(e) => {
							e.preventDefault();
							register({
								email,
								password,
								options: {
									data: {
										full_name: fullName,
										purok: purok,
										street,
										block_number: blockNumber,
										house_number: houseNumber,
									},
								},
							});
						}}
						{...formProps}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								padding: 25,
							}}
						>
							<label htmlFor="email-input">
								{translate("pages.register.fields.email", "Email")}
							</label>
							<input
								id="email-input"
								name="email"
								type="email"
								size={20}
								autoCorrect="off"
								spellCheck={false}
								autoCapitalize="off"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<label htmlFor="password-input">
								{translate("pages.register.fields.password", "Password")}
							</label>
							<input
								id="password-input"
								name="password"
								type="password"
								required
								size={20}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<label htmlFor="full-name-input">
								{translate("pages.register.fields.fullName", "Full Name")}
							</label>
							<input
								id="full-name-input"
								name="full_name"
								type="text"
								required
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
							<label htmlFor="purok-input">
								{translate("pages.register.fields.purok", "Purok")}
							</label>
							<input
								id="purok-input"
								name="purok"
								type="text"
								required
								value={purok}
								onChange={(e) => setPurok(e.target.value)}
							/>
							<label htmlFor="street-input">
								{translate("pages.register.fields.street", "Street")}
							</label>
							<input
								id="street-input"
								name="street"
								type="text"
								value={street}
								onChange={(e) => setStreet(e.target.value)}
							/>
							<label htmlFor="block-number-input">
								{translate("pages.register.fields.blockNumber", "Block Number")}
							</label>
							<input
								id="block-number-input"
								name="block_number"
								type="text"
								value={blockNumber}
								onChange={(e) => setBlockNumber(e.target.value)}
							/>
							<label htmlFor="house-number-input">
								{translate("pages.register.fields.houseNumber", "House Number")}
							</label>
							<input
								id="house-number-input"
								name="house_number"
								type="text"
								value={houseNumber}
								onChange={(e) => setHouseNumber(e.target.value)}
							/>
							<input
								type="submit"
								value={translate("pages.register.buttons.submit", "Sign up")}
								disabled={isLoading}
							/>
							{loginLink ?? (
								<span>
									{translate(
										"pages.login.buttons.haveAccount",
										"Have an account?",
									)}{" "}
									{renderLink(
										"/login",
										translate("pages.login.signin", "Sign in"),
									)}
								</span>
							)}
						</div>
					</form>
				</>
			)}
			{loginLink !== false && hideForm && (
				<div style={{ textAlign: "center" }}>
					{translate("pages.login.buttons.haveAccount", "Have an account?")}{" "}
					{renderLink("/login", translate("pages.login.signin", "Sign in"))}
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
