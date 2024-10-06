import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TableType } from "@/types/dev.types";
import { supabaseClient } from "@/utility";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from '@supabase/supabase-js';
import { AlertCircle, Briefcase, CloudUpload, DollarSign, Edit, Gavel, Home, MapPin, Paperclip, Phone, Trash2, User as UserIcon } from "lucide-react";
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from 'sonner';
import { z } from "zod";

// Icons for different complaint types
const complaintTypeIcons = {
    "Civil Disputes Between Neighbors and Family Members": <UserIcon className="w-5 h-5 mr-2" />,
    "Collection of Debts": <DollarSign className="w-5 h-5 mr-2" />,
    "Issues Not Covered by Law or Public Order": <AlertCircle className="w-5 h-5 mr-2" />,
    "Disputes Involving Property": <Home className="w-5 h-5 mr-2" />,
    "Minor Criminal Offenses": <Gavel className="w-5 h-5 mr-2" />,
    "Conflicts Over Personal Relationships": <UserIcon className="w-5 h-5 mr-2" />,
};

// Allowed roles based on schema constraints
const roleOptions = ["Respondent", "Complainant", "Witness"];

// Unified schema for complaint form validation including persons involved
const complaintSubmissionSchema = z.object({
    complaint_type_id: z.string().min(1, { message: "This field is required" }),
    case_title: z.string().min(1, { message: "This field is required" }),
    description: z.string().min(1, { message: "This field is required" }),
    barangay_id: z.string().min(1, { message: "This field is required" }),
    persons: z.array(
        z.object({
            first_name: z.string().min(1, { message: "This field is required" }),
            last_name: z.string().min(1, { message: "This field is required" }),
            address: z.string().min(1, { message: "This field is required" }),
            contact_info: z.string().min(1, { message: "This field is required" }),
            role: z.string().min(1, { message: "This field is required" }),
            person_id: z.string().optional(),
        })
    ).min(1, { message: "At least one person is required" }),
    uploadedFiles: z.array(z.instanceof(File)).optional(),
});

type ComplaintFormData = z.infer<typeof complaintSubmissionSchema>;

export const ComplainCreate = () => {
    // State for the logged-in user
    const [user, setUser] = useState<User | null>(null);

    // Fetch the current user
    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
            } else {
                setUser(user);
            }
        };
        getUser();
    }, []);

    // State for complaint types and barangays
    const [typeOfComplaint, setTypeOfComplaint] = useState<TableType<"complaint_types">[]>([]);
    const [barangays, setBarangays] = useState<TableType<"barangays">[]>([]);

    // Fetch complaint types and barangays
    useEffect(() => {
        const fetchData = async () => {
            // Fetch complaint types
            const { data: complaintTypesData, error: complaintTypesError } = await supabaseClient
                .from('complaint_types')
                .select('*');
            if (complaintTypesError) {
                console.error('Error fetching complaint types:', complaintTypesError);
            } else {
                setTypeOfComplaint(complaintTypesData || []);
            }

            // Fetch barangays
            const { data: barangaysData, error: barangaysError } = await supabaseClient
                .from('barangays')
                .select('*');
            if (barangaysError) {
                console.error('Error fetching barangays:', barangaysError);
            } else {
                setBarangays(barangaysData || []);
            }
        };
        fetchData();
    }, []);

    // Initialize the complaint form with the unified schema
    const complaintForm = useForm<ComplaintFormData>({
        resolver: zodResolver(complaintSubmissionSchema),
        defaultValues: {
            complaint_type_id: "",
            case_title: "",
            description: "",
            barangay_id: "",
            persons: [],
            uploadedFiles: [],
        },
    });

    const { handleSubmit, formState, control, setValue, getValues } = complaintForm;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

    // Function to add or update a person in the participants list
    const addOrUpdatePerson = (data: z.infer<typeof complaintSubmissionSchema>["persons"][number]) => {
        const currentPersons = getValues("persons");
        if (editingIndex !== null) {
            currentPersons[editingIndex] = { ...data };
            toast.success('Person updated successfully');
        } else {
            currentPersons.push({ ...data });
            toast.success('Person added successfully');
        }
        setValue("persons", currentPersons);
        setEditingIndex(null);
        setIsDialogOpen(false);
        personForm.reset();
    };

    // Function to edit a person in the participants list
    const editPerson = (index: number) => {
        const person = getValues("persons")[index];
        personForm.reset(person);
        setEditingIndex(index);
        setIsDialogOpen(true);
    };

    // Function to remove a person from the participants list
    const removePerson = (index: number) => {
        const currentPersons = getValues("persons").filter((_, i) => i !== index);
        setValue("persons", currentPersons);
        toast.success('Person removed successfully');
    };

    // Initialize the person form for adding participants
    const personForm = useForm({
        resolver: zodResolver(
            z.object({
                first_name: z.string().min(1, { message: "This field is required" }),
                last_name: z.string().min(1, { message: "This field is required" }),
                address: z.string().min(1, { message: "This field is required" }),
                contact_info: z.string().min(1, { message: "This field is required" }),
                role: z.string().min(1, { message: "This field is required" }),
                person_id: z.string().optional(),
            })
        ),
        defaultValues: {
            first_name: "",
            last_name: "",
            address: "",
            contact_info: "",
            role: "",
            person_id: "",
        },
    });

    // Dropzone configuration for file uploads
    const dropZoneConfig = {
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
            'application/pdf': ['.pdf'],
            'video/*': ['.mp4', '.avi', '.mov'],
            'application/msword': ['.doc', '.docx'],
        },
        maxFiles: 5,
        maxSize: 10 * 1024 * 1024, // 10 MB
        multiple: true,
    };

    // Function to handle form submission
    const onSubmit: SubmitHandler<ComplaintFormData> = async (data) => {
        if (!user) {
            toast.error('User not logged in');
            return;
        }

        setIsReviewDialogOpen(true);
    };

    const handleFinalSubmit = async () => {
        const data = getValues();
        setIsReviewDialogOpen(false);

        const rollbackSteps = [];

        toast.promise(
            (async () => {
                try {
                    // Insert the complaint
                    const { data: complaintData, error: complaintError } = await supabaseClient
                        .from('complaints')
                        .insert({
                            case_title: data.case_title,
                            description: data.description,
                            complaint_type_id: data.complaint_type_id,
                            barangay_id: data.barangay_id,
                        })
                        .select('id')
                        .single();

                    if (complaintError) throw complaintError;

                    const complaint_id = complaintData.id;
                    rollbackSteps.push(() => supabaseClient.from('complaints').delete().eq('id', complaint_id));

                    toast.success('Complaint created successfully');

                    // Add participants
                    const complaintParticipants = [
                        {
                            complaint_id: complaint_id,
                            user_id: user?.id || null,
                            role: 'Complainant',
                        },
                    ];

                    for (const person of data.persons) {
                        let person_id = person.person_id;

                        if (!person_id) {
                            const { data: personData, error: personError } = await supabaseClient
                                .from('people')
                                .insert({
                                    first_name: person.first_name,
                                    last_name: person.last_name,
                                    address: person.address,
                                    contact_info: person.contact_info,
                                })
                                .select('person_id')
                                .single();

                            if (personError) throw personError;

                            person_id = personData.person_id;
                            rollbackSteps.push(() => supabaseClient.from('people').delete().eq('person_id', person_id));
                        }

                        complaintParticipants.push({
                            complaint_id: complaint_id,
                            user_id: person.person_id || null,
                            role: person.role,
                        });
                    }

                    await Promise.all(complaintParticipants.map(async (participant) => {
                        const { error } = await supabaseClient.from('complaint_participants').insert(participant);
                        if (error) throw error;
                    }));

                    rollbackSteps.push(() => supabaseClient.from('complaint_participants').delete().eq('complaint_id', complaint_id));

                    toast.success('Participants added successfully');

                    // Upload files
                    if (data.uploadedFiles && data.uploadedFiles.length > 0) {
                        await Promise.all(data.uploadedFiles.map(async (file) => {
                            const { data: fileData, error: fileError } = await supabaseClient.storage
                                .from('complaint_documents')
                                .upload(`complaints/${complaint_id}/${file.name}`, file);

                            if (fileError) throw fileError;

                            const { error: documentError } = await supabaseClient.from('complaint_documents').insert({
                                complaint_id: complaint_id,
                                file_name: file.name,
                                file_path: fileData.path,
                            });

                            if (documentError) throw documentError;
                        }));
                        toast.success('Files uploaded successfully');
                    }

                    return 'Complaint submission completed successfully';
                } catch (error) {
                    console.error('Error during complaint submission:', error);

                    // Rollback any successful operations
                    for (const rollbackStep of rollbackSteps.reverse()) {
                        try {
                            await rollbackStep();
                        } catch (rollbackError) {
                            console.error('Error during rollback:', rollbackError);
                        }
                    }

                    throw error;
                }
            })(),
            {
                loading: 'Submitting complaint...',
                success: (message) => message,
                error: (error) => `Submission failed: ${error.message}`,
            }
        );
    };

    return (
        <div className="container p-6 mx-auto">
            <div className="grid max-w-xl grid-cols-1 gap-8 mx-auto md:grid-cols-1">
                <div>
                    <h1 className="mb-6 text-3xl font-bold">File a Complaint</h1>
                    <Form {...complaintForm}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Complaint Type Field */}
                            <FormField
                                control={control}
                                name="complaint_type_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complaint Type</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Complaint Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typeOfComplaint.map((type) => (
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
                            {/* Case Title Field */}
                            <FormField
                                control={control}
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
                            {/* Description Field */}
                            <FormField
                                control={control}
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
                            {/* Barangay Field */}
                            <FormField
                                control={control}
                                name="barangay_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Barangay</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Barangay" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {barangays.map((barangay) => (
                                                        <SelectItem key={barangay.barangay_id} value={barangay.barangay_id}>
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
                            {/* File Upload Field */}
                            <FormField
                                control={control}
                                name="uploadedFiles"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Attach Document</FormLabel>
                                        <FormControl>
                                            <FileUploader
                                                value={field.value || null}
                                                onValueChange={field.onChange}
                                                dropzoneOptions={dropZoneConfig}
                                                className="relative p-2 rounded-lg bg-card"
                                            >
                                                <FileInput
                                                    id="fileInput"
                                                    className="outline-dashed outline-1 outline-slate-500"
                                                >
                                                    <div className="flex flex-col items-center justify-center w-full p-8 ">
                                                        <CloudUpload className='w-10 h-10 text-gray-500' />
                                                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-semibold">Click to upload</span>
                                                            &nbsp; or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Supported file types: JPG, PNG, GIF, PDF, DOC, MP4
                                                        </p>
                                                    </div>
                                                </FileInput>
                                                <FileUploaderContent>
                                                    {field.value?.map((file: File, index: number) => (
                                                        <FileUploaderItem key={`${file.name}-${index}`} index={index}>
                                                            <Paperclip className="w-4 h-4 stroke-current" />
                                                            <span>{file.name}</span>
                                                        </FileUploaderItem>
                                                    ))}
                                                </FileUploaderContent>
                                            </FileUploader>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <div className="flex flex-row items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Persons Involved</h2>
                                    <Button type="button" onClick={() => { setEditingIndex(null); personForm.reset(); setIsDialogOpen(true); }}>
                                        Add Person
                                    </Button>
                                </div>
                                {/* Dialog for Adding/Editing Person */}
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingIndex !== null ? 'Edit Person' : 'Add Person'}</DialogTitle>
                                        </DialogHeader>
                                        <Form {...personForm}>
                                            <form onSubmit={personForm.handleSubmit((data) => addOrUpdatePerson(data))} className="space-y-4">
                                                {/* Role Field */}
                                                <FormField
                                                    control={personForm.control}
                                                    name="role"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Role</FormLabel>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
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
                                                {/* First Name Field */}
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
                                                {/* Last Name Field */}
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
                                                {/* Address Field */}
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
                                                {/* Contact Info Field */}
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
                                {/* Displaying the List of Participants */}
                                <div className="grid gap-4 mt-4">
                                    {getValues("persons").length === 0 ? (
                                        <Card>
                                            <CardContent className="p-4 text-center text-muted-foreground/85">
                                                <UserIcon className="w-8 h-10 mx-auto" />
                                                <p className="text-sm">No participants added yet.</p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        getValues("persons").map((person, index) => (
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
                            <Button type="submit" disabled={formState.isSubmitting}>
                                File Complaint
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
            {/* Review Dialog */}
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogContent className="max-w-3xl mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">Review Your Complaint</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-6">
                            <section>
                                <h3 className="mb-2 text-lg font-semibold">Complaint Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Complaint Type</p>
                                        <p>{typeOfComplaint.find(t => t.complaint_type_id === getValues("complaint_type_id"))?.description || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Barangay</p>
                                        <p>{barangays.find(b => b.barangay_id === getValues("barangay_id"))?.name || "N/A"}</p>
                                    </div>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="mb-2 text-lg font-semibold">Case Information</h3>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Case Title</p>
                                        <p>{getValues("case_title")}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Description</p>
                                        <p className="whitespace-pre-wrap">{getValues("description")}</p>
                                    </div>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="mb-2 text-lg font-semibold">Persons Involved</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {getValues("persons").map((person, index) => (
                                        <Card key={index}>
                                            <CardContent className="p-4">
                                                <p className="font-semibold">{`${person.first_name} ${person.last_name}`}</p>
                                                <p className="text-sm text-gray-600">{person.role}</p>
                                                <p className="text-sm text-gray-600">{person.address}</p>
                                                <p className="text-sm text-gray-600">{person.contact_info}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="mb-2 text-lg font-semibold">Attached Files</h3>
                                {getValues("uploadedFiles")?.length > 0 ? (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {getValues("uploadedFiles").map((file, index) => (
                                            <div key={index} className="flex items-center p-2 space-x-2 border rounded">
                                                <Paperclip className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm truncate">{file.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600">No files attached</p>
                                )}
                            </section>
                        </div>
                    </ScrollArea>
                    <div className="mt-6">
                        <p className="text-sm text-center text-gray-600">
                            By submitting, you confirm that all information is accurate and you adhere to the barangay complaint agreement.
                        </p>
                        <div className="flex justify-end mt-4 space-x-2">
                            <Button onClick={handleFinalSubmit}>Submit</Button>
                            <Button variant="secondary" onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};