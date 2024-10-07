import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableType } from "@/types/dev.types";
import {
	RegisterPageProps,
	useActiveAuthProvider,
	useLink,
	useList,
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
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	const [barangayId, setBarangayId] = useState("");
	const [address, setAddress] = useState("");

	const { data: barangays } = useList<TableType<"barangays">>({
		resource: "barangays",
	});
	const barangaysData = barangays?.data;

	const translate = useTranslate();

	const authProvider = useActiveAuthProvider();
	const { mutate: register, isLoading } = useRegister({
		v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
	});

	const [step, setStep] = useState(1);

	const handleNextStep = (e: React.FormEvent) => {
		e.preventDefault();
		setStep(2);
	};

	const handlePreviousStep = (e: React.FormEvent) => {
		e.preventDefault();
		setStep(1);
	};

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();
		register({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					middle_name: middleName,
					last_name: lastName,
					address: address,
					barangay_id: barangayId,
				},
			},
		});
	};

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
		<div {...contentProps} className="flex flex-col items-center justify-center min-h-screen p-6">
			<div className="p-4">
				<h1 className="text-2xl font-semibold text-center">
					{translate("pages.register.title", "Sign up for your account")}
				</h1>
			</div>
			<Card className="w-full max-w-md shadow-lg">
				<CardContent className="p-4">
					{renderProviders()}
					{!hideForm && (
						<form
							onSubmit={step === 1 ? handleNextStep : handleRegister}
							{...formProps}
							className="space-y-4"
						>
							{step === 1 && (
								<div className="grid grid-cols-1 gap-4">
									<div className="space-y-2">
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
											className="w-full"
										/>
									</div>
									<div className="space-y-2">
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
											className="w-full"
										/>
									</div>
									<Button
										type="submit"
										className="w-full text-white bg-blue-500 hover:bg-blue-600"
									>
										{translate("pages.register.buttons.next", "Next")}
									</Button>
								</div>
							)}
							{step === 2 && (
								<div className="grid grid-cols-1 gap-4">
									<div className="space-y-2">
										<Label htmlFor="first-name-input">
											{translate("pages.register.fields.firstName", "First Name")}
										</Label>
										<Input
											id="first-name-input"
											name="first_name"
											type="text"
											required
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											className="w-full"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="middle-name-input">
											{translate("pages.register.fields.middleName", "Middle Name")}
										</Label>
										<Input
											id="middle-name-input"
											name="middle_name"
											type="text"
											value={middleName}
											onChange={(e) => setMiddleName(e.target.value)}
											className="w-full"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="last-name-input">
											{translate("pages.register.fields.lastName", "Last Name")}
										</Label>
										<Input
											id="last-name-input"
											name="last_name"
											type="text"
											required
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											className="w-full"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="barangay-id-input">
											{translate("pages.register.fields.barangayId", "Barangay")}
										</Label>
										<Select
											value={barangayId}
											onValueChange={(value) => setBarangayId(value)}
										>
											<SelectTrigger id="barangay-id-input" className="w-full">
												<SelectValue placeholder={translate("pages.register.fields.barangayId", "Select Barangay ID")} />
											</SelectTrigger>
											<SelectContent>
												{barangaysData?.map((barangay) => (
													<SelectItem key={barangay.id} value={barangay.id}>
														{barangay.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="address-input">
											{translate("pages.register.fields.address", "Address")}
										</Label>
										<Input
											id="address-input"
											name="address"
											type="text"
											required
											value={address}
											onChange={(e) => setAddress(e.target.value)}
											className="w-full"
										/>
									</div>
									<div className="flex justify-between gap-4">
										<Button
											type="button"
											onClick={handlePreviousStep}
											className="w-full text-white bg-gray-500 hover:bg-gray-600"
										>
											{translate("pages.register.buttons.back", "Back")}
										</Button>
										<Button
											type="submit"
											disabled={isLoading}
											className="w-full text-white bg-blue-500 hover:bg-blue-600"
										>
											{translate("pages.register.buttons.submit", "Sign up")}
										</Button>
									</div>
								</div>
							)}
						</form>
					)}
					{loginLink !== false && hideForm && (
						<div className="text-sm text-center text-gray-600">
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