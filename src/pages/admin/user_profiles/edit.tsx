import { zodResolver } from "@hookform/resolvers/zod";
import { useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";

import {
    Button,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { TableType } from "@/types/dev.types";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const luponEditSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
    barangay_id: z.string(),
});

type LuponFormValues = z.infer<typeof luponEditSchema>;

export const ManageLuponEdit: React.FC = () => {
    const { id } = useParams();
    const { data: barangays, isLoading: barangaysLoading } = useList<TableType<"barangays">>({
        resource: "barangays",
    });
    const barangaysData = barangays?.data;

    const methods = useForm<LuponFormValues>({
        resolver: zodResolver(luponEditSchema),
        refineCoreProps: {
            id,
            action: "edit",
            resource: "users",
            meta: { idColumnName: "user_id" },
            onMutationSuccess: () => {
                toast.success("Lupon Profile Successfully Updated")
            },
            onMutationError: () => {
                toast.error("Something went wrong.")
            }
        },
    });

    const {
        formState: { isLoading },
        handleSubmit,
    } = methods;

    const onSubmit = (data: any) => {
        methods.refineCore.onFinish(data);
    };

    if (isLoading || barangaysLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Skeleton className="w-full h-12" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl p-6 mx-auto">
            <Link to="/admin/manage/lupons" className="inline-flex items-center mb-4 font-bold">
                <ChevronLeft className="size-5"/>
                Back
            </Link>
            <Card className="p-6 shadow-lg">
                <h2 className="mb-4 text-2xl font-semibold">Edit Lupon</h2>
                <Form {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <FormField
                                control={methods.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter first name"
                                                className="mt-1"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={methods.control}
                                name="middle_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Middle Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter middle name"
                                                className="mt-1"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={methods.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter last name"
                                                className="mt-1"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={methods.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter address"
                                                className="mt-1"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={methods.control}
                                name="barangay_id"
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-2">
                                        <FormLabel>Barangay</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value ? field.value.toString() : ""}
                                                onValueChange={(value) => field.onChange(value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a barangay" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {barangaysData?.map((barangay) => (
                                                        <SelectItem key={barangay.id} value={barangay.id}>
                                                            {barangay.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        Saving Changes...
                                    </div>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
};
