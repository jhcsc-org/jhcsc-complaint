import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
					<Button
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
						{provider.label ?? <Label>{provider.label}</Label>}
					</Button>
				</div>
			));
		}
		return null;
	};

	const content = (
		<div {...contentProps} className="flex flex-col items-center justify-center p-6 gap-2 min-h-screen">
		<Card className="w-full max-w-sm" >
			<CardHeader>
				<CardTitle style={{ textAlign: "center" }}>
					{translate("pages.register.title", "Sign up for your account")}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{renderProviders()}
				{!hideForm && (
					
						
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
								
							>
								<Label htmlFor="email-input">
									{translate("pages.register.fields.email", "Email")}
								</Label>
								<Input
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
								<Label htmlFor="password-input">
									{translate("pages.register.fields.password", "Password")}
								</Label>
								<Input
									id="password-input"
									name="password"
									type="password"
									required
									size={20}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Label htmlFor="full-name-input">
									{translate("pages.register.fields.fullName", "Full Name")}
								</Label>
								<Input
									id="full-name-input"
									name="full_name"
									type="text"
									required
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
								/>
								<Label htmlFor="purok-input">
									{translate("pages.register.fields.purok", "Purok")}
								</Label>
								<Input
									id="purok-input"
									name="purok"
									type="text"
									required
									value={purok}
									onChange={(e) => setPurok(e.target.value)}
								/>
								<Label htmlFor="street-input">
									{translate("pages.register.fields.street", "Street")}
								</Label>
								<Input
									id="street-input"
									name="street"
									type="text"
									value={street}
									onChange={(e) => setStreet(e.target.value)}
								/>
								<Label htmlFor="block-number-input">
									{translate("pages.register.fields.blockNumber", "Block Number")}
								</Label>
								<Input
									id="block-number-input"
									name="block_number"
									type="text"
									value={blockNumber}
									onChange={(e) => setBlockNumber(e.target.value)}
								/>
								<Label htmlFor="house-number-input">
									{translate("pages.register.fields.houseNumber", "House Number")}
								</Label>
								<Input
									id="house-number-input"
									name="house_number"
									type="text"
									value={houseNumber}
									onChange={(e) => setHouseNumber(e.target.value)}
								/>
								<div className="flex flex-col items-center gap-2 mt-2">
									<Button
										type="submit"
										disabled={isLoading}
									>
										{translate("pages.register.buttons.submit", "Sign up")}
									</Button>
									<div className="flex flex-col justify-center items-center">
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
								</div>
							</div>
						</form>
					
				)}
				{loginLink !== false && hideForm && (
					<div style={{ textAlign: "center" }}>
							{translate("pages.login.buttons.haveAccount", "Have an account?")}{" "}
							{renderLink("/login", translate("pages.login.signin", "Sign in"))}
					</div>
				)}
			</CardContent>
		</Card>
	
	</div>
	);

	return (
		<div {...wrapperProps}>
			{renderContent ? renderContent(content, title) : content}
		</div>
	);
};
