import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableType } from "@/types/dev.types";
import { supabaseClient } from "@/utility";
import { useList, useTranslate } from "@refinedev/core";
import React, { useState } from "react";
import { toast } from "sonner";

export const AdminAddLupon = () => {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [barangayId, setBarangayId] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: barangays } = useList<TableType<"barangays">>({
        resource: "barangays",
    });
    const barangaysData = barangays?.data;

    const translate = useTranslate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsDialogOpen(true);
    };

    const confirmRegister = async () => {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                        address: address,
                        role_id: 5,
                        barangay_id: barangayId,
                    }
                }
            });

            if (error) {
                throw new Error("Failed to register lupon.");
            }

            const { error: insertError } = await supabaseClient.from('lupons').insert({
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                address: address,
                role_id: 5,
                barangay_id: barangayId,
                user_id: data.user?.id,
            });

            if (insertError) {
                throw new Error("Failed to save lupon details.");
            }
            toast.success("Lupon registered successfully.");
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An unknown error occurred");
            }
        } finally {
            setIsDialogOpen(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div className="p-4">
                <h1 className="text-2xl font-semibold text-center">
                    {translate("pages.admin.addLupon.title", "Register a Lupon")}
                </h1>
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email-input">
                                {translate("pages.admin.addLupon.fields.email", "Email")}
                            </Label>
                            <Input
                                id="email-input"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-input">
                                {translate("pages.admin.addLupon.fields.password", "Password")}
                            </Label>
                            <Input
                                id="password-input"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="first-name-input">
                                {translate("pages.admin.addLupon.fields.firstName", "First Name")}
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
                                {translate("pages.admin.addLupon.fields.middleName", "Middle Name")}
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
                                {translate("pages.admin.addLupon.fields.lastName", "Last Name")}
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
                                {translate("pages.admin.addLupon.fields.barangayId", "Barangay")}
                            </Label>
                            <Select
                                value={barangayId}
                                onValueChange={(value) => setBarangayId(value)}
                            >
                                <SelectTrigger id="barangay-id-input" className="w-full">
                                    <SelectValue placeholder={translate("pages.admin.addLupon.fields.barangayId", "Select Barangay ID")} />
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
                                {translate("pages.admin.addLupon.fields.address", "Address")}
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
                        <Button
                            type="submit"
                            className="w-full text-white bg-blue-500 hover:bg-blue-600"
                        >
                            {translate("pages.admin.addLupon.buttons.submit", "Register Lupon")}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Registration</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to register this lupon?</p>
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmRegister} className="text-white bg-blue-500">
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
