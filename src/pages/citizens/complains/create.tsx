import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TableType } from "@/types/dev.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { AlertCircle, Briefcase, DollarSign, Edit, Gavel, Home, MapPin, Phone, Trash2, User as UserIcon } from "lucide-react";
import { useState } from 'react';
import { FieldValues, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const complaintTypeIcons = {
    "Civil Disputes Between Neighbors and Family Members": <UserIcon className="w-5 h-5 mr-2" />,
    "Collection of Debts": <DollarSign className="w-5 h-5 mr-2" />,
    "Issues Not Covered by Law or Public Order": <AlertCircle className="w-5 h-5 mr-2" />,
    "Disputes Involving Property": <Home className="w-5 h-5 mr-2" />,
    "Minor Criminal Offenses": <Gavel className="w-5 h-5 mr-2" />,
    "Conflicts Over Personal Relationships": <UserIcon className="w-5 h-5 mr-2" />,
};

const complaintFormSchema = z.object({
    complaint_type_id: z.string().min(1, { message: "This field is required" }),
    case_title: z.string().min(1, { message: "This field is required" }),
    description: z.string().min(1, { message: "This field is required" }),
});

const personFormSchema = z.object({
    first_name: z.string().min(1, { message: "This field is required" }),
    last_name: z.string().min(1, { message: "This field is required" }),
    address: z.string().min(1, { message: "This field is required" }),
    contact_info: z.string().min(1, { message: "This field is required" }),
    role: z.string().min(1, { message: "This field is required" }),
});

const roleOptions = [
    "Co-complainant",
    "Respondent",
    "Witness",
    "Other"
];

export const ComplainCreate = () => {
    const complaintForm = useForm<z.infer<typeof complaintFormSchema>>({
        resolver: zodResolver(complaintFormSchema),
        defaultValues: {
            complaint_type_id: "",
            case_title: "",
            description: "",
        },
    });

    const personForm = useForm<z.infer<typeof personFormSchema>>({
        resolver: zodResolver(personFormSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            address: "",
            contact_info: "",
        },
    });

    const { handleSubmit, formState, refineCore: { onFinish } } = complaintForm;
    const { data: typeOfComplaint } = useList<TableType<"complaint_types">>({ resource: "complaint_types" });
    const [persons, setPersons] = useState<Array<Omit<TableType<"people">, "created_at" | "updated_at"> & { role: string }>>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [otherRole, setOtherRole] = useState("");

    const addOrUpdatePerson = (data: z.infer<typeof personFormSchema>) => {
        if (editingIndex !== null) {
            const newPersons = [...persons];
            newPersons[editingIndex] = { ...data, person_id: persons[editingIndex].person_id, role: data.role };
            setPersons(newPersons);
            setEditingIndex(null);
        } else {
            setPersons([...persons, { ...data, person_id: "", role: data.role }]);
        }
        setIsDialogOpen(false);
        personForm.reset();
    };

    const editPerson = (index: number) => {
        const person = persons[index];
        personForm.reset(person);
        setEditingIndex(index);
        setIsDialogOpen(true);
    };

    const removePerson = (index: number) => {
        setPersons(persons.filter((_, i) => i !== index));
    };

    return (
        <div className="container p-6 mx-auto">
            <div className="grid max-w-xl grid-cols-1 gap-8 mx-auto md:grid-cols-1">
                <div>
                    <h1 className="mb-6 text-3xl font-bold">File a Complaint</h1>
                    <Form {...complaintForm}>
                        <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
                            <FormField
                                control={complaintForm.control}
                                name="complaint_type_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complaint Type</FormLabel>
                                        <FormControl>
                                            <Select {...field} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Complaint Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typeOfComplaint?.data.map((type) => (
                                                        <SelectItem key={type.complaint_type_id} value={type.complaint_type_id}>
                                                            <div className="flex items-center">
                                                                {complaintTypeIcons[type.description as keyof typeof complaintTypeIcons] || <Briefcase className="w-5 h-5 mr-2" />}
                                                                <span>{type.description}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={complaintForm.control}
                                name="case_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Case Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={complaintForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea className="h-40 resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={formState.isSubmitting}>
                                Save Complaint
                            </Button>
                        </form>
                    </Form>
                </div>
                <div>
                    <div className="flex flex-row items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Persons Involved</h2>
                        <Button onClick={() => { setEditingIndex(null); personForm.reset(); setIsDialogOpen(true); }}>
                            Add Person
                        </Button>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild />
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingIndex !== null ? 'Edit Person' : 'Add Person'}</DialogTitle>
                            </DialogHeader>
                            <Form {...personForm}>
                                <form onSubmit={personForm.handleSubmit(addOrUpdatePerson as SubmitHandler<FieldValues>)} className="space-y-4">
                                    <FormField
                                        control={personForm.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            if (value !== "Other") {
                                                                setOtherRole("");
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {roleOptions.map((role) => (
                                                                <SelectItem key={role} value={role}>
                                                                    {role}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {personForm.watch("role") === "Other" && (
                                        <FormField
                                            control={personForm.control}
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Specify Other Role</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={otherRole}
                                                            onChange={(e) => {
                                                                setOtherRole(e.target.value);
                                                                field.onChange(e.target.value);
                                                            }}
                                                            placeholder="Enter custom role"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    <FormField
                                        control={personForm.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={personForm.control}
                                        name="last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={personForm.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={personForm.control}
                                        name="contact_info"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Info</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">
                                        {editingIndex !== null ? 'Update Person' : 'Add Person'}
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                    <div className="grid gap-4 mt-4">
                        {persons.length === 0 ? (
                            <Card>
                                <CardContent className="p-4 text-center text-muted-foreground/85">
                                    <UserIcon className="w-8 h-10 mx-auto" />
                                    <p className="text-sm">No participants added yet.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            persons.map((person, index) => (
                                <Card key={`${person.first_name}-${index}`}>
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-semibold">{`${person.first_name} ${person.last_name}`}</h3>
                                                <Badge variant="outline">{person.role}</Badge>
                                            </div>
                                            <div className="flex flex-row flex-wrap gap-2">
                                                <p className="inline-flex text-sm text-gray-600"><MapPin className="w-4 h-4 mr-2" /> {person.address}</p>
                                                <p className="inline-flex text-sm text-gray-600"><Phone className="w-4 h-4 mr-2" /> {person.contact_info}</p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <Button variant="ghost" size="icon" onClick={() => editPerson(index)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => removePerson(index)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};