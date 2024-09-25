import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ForgotPasswordFormTypes,
  ForgotPasswordPageProps,
  useForgotPassword,
  useLink,
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

type ForgotPasswordProps = ForgotPasswordPageProps<
	DivPropsType,
	DivPropsType,
	FormPropsType
>;

export const ForgotPasswordPage: React.FC<ForgotPasswordProps> = ({
	loginLink,
	wrapperProps,
	contentProps,
	renderContent,
	formProps,
	title = undefined,
}) => {
	const translate = useTranslate();
	const routerType = useRouterType();
	const Link = useLink();
	const { Link: LegacyLink } = useRouterContext();

	const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

	const [email, setEmail] = useState("");

	const { mutate: forgotPassword, isLoading } =
		useForgotPassword<ForgotPasswordFormTypes>();

	const renderLink = (link: string, text?: string) => {
		return <ActiveLink to={link}>{text}</ActiveLink>;
	};

	const content = (
    <div {...contentProps}
    className="flex justify-center items-center min-h-screen">
		<Card
			className="w-full max-w-sm"
		>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						forgotPassword({ email });
					}}
					{...formProps}
				>
					<div className="flex flex-col p-6 gap-2">
						<CardHeader>
							<CardTitle>
								{translate(
									"pages.forgotPassword.title",
									"Forgot your password?",
								)}
							</CardTitle>
						</CardHeader>
						<Label htmlFor="email-input">
							{translate("pages.forgotPassword.fields.email", "Email")}
						</Label>
						<Input
            className=""
							id="email-input"
							name="email"
							type="email"
							autoCorrect="off"
							spellCheck={false}
							autoCapitalize="off"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Button className="mt-2" type="submit" disabled={isLoading}>
							{translate(
								"pages.forgotPassword.buttons.submit",
								"Send reset instructions",
							)}
						</Button>
						<br />
						{loginLink ?? (
							<span>
								{translate(
									"pages.register.buttons.haveAccount",
									"Have an account? ",
								)}{" "}
								{renderLink(
									"/login",
									translate("pages.login.signin", "Sign in"),
								)}
							</span>
						)}
					</div>
				</form>
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
