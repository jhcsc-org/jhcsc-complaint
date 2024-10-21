import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContainer, DialogContent, DialogTrigger } from "@/components/ui/motion-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TableType } from "@/types/dev.types";
import { supabaseClient } from "@/utility";
import { useList, useNavigation, useResource, useShow } from "@refinedev/core";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronLeft, DollarSign, FileIcon, Gavel, Home, MapPin, Paperclip, Phone, UserIcon, XIcon } from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";

const DialogImage = lazy(() => import('@/components/ui/motion-dialog').then(mod => ({ default: mod.DialogImage })));

const complaintTypeIcons: Record<string, JSX.Element> = {
    "Civil Disputes Between Neighbors and Family Members": <UserIcon className="w-4 h-4 mr-2" />,
    "Collection of Debts": <DollarSign className="w-4 h-4 mr-2" />,
    "Issues Not Covered by Law or Public Order": <AlertCircle className="w-4 h-4 mr-2" />,
    "Disputes Involving Property": <Home className="w-4 h-4 mr-2" />,
    "Minor Criminal Offenses": <Gavel className="w-4 h-4 mr-2" />,
    "Conflicts Over Personal Relationships": <UserIcon className="w-4 h-4 mr-2" />,
};

const fadeInVariants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: {
        opacity: 0,
        filter: "blur(4px)",
        transition: { duration: 0.2, ease: "easeInOut" }
    }
};

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export const LuponComplainShow: React.FC = () => {
    const { list } = useNavigation();
    const { id } = useResource();
    const { queryResult } = useShow<TableType<"complaint_view">>({
        resource: "complaint_view",
        id,
        meta: {
            idColumnName: "complaint_id",
        }
    });

    const { data: participantsData } = useList<TableType<"complaint_participants"> & { people: TableType<"people"> }>({
        resource: "complaint_participants",
        meta: {
            select: ("*, people(*)")
        },
        filters: [
            {
                field: "complaint_id",
                operator: "eq",
                value: id,
            },
        ],
    });

    const { data: historyData } = useList<TableType<"complaint_history">>({
        resource: "complaint_history",
        filters: [
            {
                field: "complaint_id",
                operator: "eq",
                value: id,
            },
        ],
        sorters: [
            {
                field: "action_date",
                order: "desc",
            },
        ],
    });

    const { data: documentsData } = useList<TableType<"complaint_documents">>({
        resource: "complaint_documents",
        meta: {
            select: ("*")
        },
        filters: [
            {
                field: "complaint_id",
                operator: "eq",
                value: id,
            },
        ],
    });

    const { data, isLoading } = queryResult;
    const record = data?.data;

    const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
    const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    useEffect(() => {
        if (documentsData) {
            const fetchUrls = async () => {
                const urls: Record<string, string> = {};
                const errors: Record<string, string> = {};
                for (const doc of documentsData.data) {
                    try {
                        const { data } = supabaseClient
                            .storage
                            .from('complaint_documents')
                            .getPublicUrl(doc.file_path);
                        if (data?.publicUrl === null) {
                            console.error(`Error fetching URL for ${doc.file_name} is not available`);
                            errors[doc.file_name] = 'Failed to fetch URL';
                            continue;
                        }
                        if (data?.publicUrl) {
                            urls[doc.file_name] = data.publicUrl;
                        } else {
                            errors[doc.file_name] = 'URL not available';
                        }
                    } catch (err) {
                        console.error(`Unexpected error for ${doc.file_name}:`, err);
                        errors[doc.file_name] = 'Unexpected error';
                    }
                }
                setDocumentUrls(urls);
                setUrlErrors(errors);
            };
            fetchUrls();
        }
    }, [documentsData]);

    const sanitizedDocumentUrls = useMemo(() => {
        return documentUrls;
    }, [documentUrls]);

    
    const {goBack, push} = useNavigation();

    if (isLoading) {
        return <div className="max-w-3xl p-4 mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Complaint Details</h1>
                <Button variant="ghost" onClick={() => push("/lupon/complaints")}><ChevronLeft className="w-4 h-4 mr-2" /> Back to List</Button>
            </div>
            <Skeleton className="max-w-3xl h-[500px] p-4 mx-auto rounded-lg bg-muted-foreground/10" />
        </div>;
    }

    return (
        <AnimatePresence mode="popLayout" initial={true}>
            <motion.div
                className="max-w-3xl p-4 mx-auto"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInVariants}
            >
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Complaint Details</h1>
                    <Button variant="ghost" onClick={() => push("/lupon/complaints")}><ChevronLeft className="w-4 h-4 mr-2" /> Back to List</Button>
                </div>
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <motion.section variants={sectionVariants}>
                            <h3 className="mb-2 text-lg font-semibold">Complaint Information</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Case Number</p>
                                    <p className="text-xs">{record?.case_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Status</p>
                                    <Badge
                                        variant="default"
                                        className={cn(
                                            "text-xs font-medium",
                                            {
                                                "bg-yellow-800 hover:bg-yellow-700": record?.status === "PENDING",
                                                "bg-blue-800 hover:bg-blue-700": record?.status === "IN_PROCESS",
                                                "bg-green-800 hover:bg-green-700": record?.status === "RESOLVED",
                                                "bg-muted-foreground/25 text-muted-foreground": record?.status === "DISMISSED",
                                            }
                                        )}
                                    >
                                        {record?.status?.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Date Filed</p>
                                    <p className="text-xs">{record?.date_filed ? new Date(record.date_filed).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Resolution Date</p>
                                    <p className="text-xs">{record?.resolution_date ? new Date(record.resolution_date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'Not resolved yet'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Barangay</p>
                                    <p className="text-xs">{record?.barangay_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Complaint Type</p>
                                    <div className="flex items-center text-xs">
                                        {record?.complaint_type && complaintTypeIcons[record.complaint_type]}
                                        <span>{record?.complaint_type}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                        <Separator />
                        <motion.section variants={sectionVariants}>
                            <h3 className="mb-2 text-lg font-semibold">Case Details</h3>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Case Title</p>
                                    <p>{record?.case_title}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm font-medium text-gray-500">Description</p>
                                    <Textarea value={record?.complaint_description || ''} className="h-24 whitespace-pre-wrap resize-none bg-background/25">{record?.complaint_description}</Textarea>
                                </div>
                            </div>
                        </motion.section>
                        <Separator />
                        <motion.section variants={sectionVariants}>
                            <h3 className="mb-2 text-lg font-semibold">Persons Involved</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {participantsData?.data.map((participant, index) => (
                                    <Card key={`${participant.people.first_name}-${index}`}>
                                        <CardContent className="flex items-center justify-between p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold">{`${participant.people.first_name} ${participant.people.last_name}`}</h3>
                                                    <Badge variant="outline">{participant.role}</Badge>
                                                </div>
                                                <div className="flex flex-row flex-wrap gap-2">
                                                    <p className="inline-flex text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 mr-2" /> {participant.people.address}
                                                    </p>
                                                    <p className="inline-flex text-sm text-gray-600">
                                                        <Phone className="w-4 h-4 mr-2" /> {participant.people.contact_info}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.section>
                        <Separator />
                        <motion.section variants={sectionVariants}>
                            <h3 className="mb-2 text-lg font-semibold">Attached Files</h3>
                            {documentsData?.data?.length ? (
                                <div className="grid gap-2 text-sm sm:grid-cols-2">
                                    {documentsData.data.map((file, index) => {
                                        const fileUrl = sanitizedDocumentUrls?.[file.file_name];
                                        const fileType = file.file_name.split('.').pop()?.toLowerCase();
                                        if (urlErrors[file.file_name]) {
                                            return (
                                                <div key={`${file.file_name}-${index}`} className="p-2 border rounded bg-red-50">
                                                    <p className="text-sm text-red-500">Error loading {file.file_name}: {urlErrors[file.file_name]}</p>
                                                </div>
                                            );
                                        }
                                        if (!fileUrl) {
                                            return (
                                                <div key={`${file.file_name}-${index}`} className="p-2 border rounded bg-yellow-50">
                                                    <p className="text-sm text-yellow-500">URL not available for {file.file_name}</p>
                                                </div>
                                            );
                                        }
                                        return (
                                            <Dialog
                                                key={`${file.file_name}-${index}`}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: 'easeInOut',
                                                }}
                                                aria-labelledby={`dialog-title-${index}`}
                                                aria-describedby={`dialog-description-${index}`}
                                            >
                                                <DialogTrigger>
                                                    <button
                                                        type="button"
                                                        className="flex items-center p-2 space-x-2 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        aria-label={`Preview ${file.file_name}`}
                                                    >
                                                        <Paperclip className="w-4 h-4 text-gray-500" />
                                                        <span className="truncate hover:underline">
                                                            {file.file_name}
                                                        </span>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContainer>
                                                    <DialogContent className='relative'>
                                                        {['jpg', 'jpeg', 'png', 'gif'].includes(fileType || '') ? (
                                                            <Suspense fallback={<p>Loading image...</p>}>
                                                                <DialogImage
                                                                    src={fileUrl}
                                                                    alt={file.file_name}
                                                                    className='h-auto w-full max-w-[90vw] rounded-[4px] object-cover lg:h-[90vh]'
                                                                />
                                                            </Suspense>
                                                        ) : ['mp4', 'webm'].includes(fileType || '') ? (
                                                            <video
                                                                controls
                                                                className='h-auto w-full max-w-[90vw] rounded-[4px] object-cover lg:h-[90vh]'
                                                                aria-label={`Video preview of ${file.file_name}`}
                                                            >
                                                                <source src={fileUrl} type={`video/${fileType}`} />
                                                                <track kind="captions" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        ) : fileType === 'pdf' ? (
                                                            <Card className="p-6">
                                                                <a
                                                                    href={fileUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center text-blue-500 underline"
                                                                >
                                                                    <FileIcon className="w-4 h-4 mr-2" />
                                                                    Preview in new tab
                                                                </a>
                                                            </Card>
                                                        ) : (
                                                            <a
                                                                href={fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 underline"
                                                            >
                                                                Download {file.file_name}
                                                            </a>
                                                        )}
                                                    </DialogContent>
                                                    <DialogClose>
                                                        <button
                                                            type="button"
                                                            className='absolute p-1 bg-white rounded-full top-4 right-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                            aria-label="Close preview"
                                                        >
                                                            <XIcon className='w-5 h-5 text-zinc-500' />
                                                        </button>
                                                    </DialogClose>
                                                </DialogContainer>
                                            </Dialog>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">No files attached</p>
                            )}
                        </motion.section>
                        <Separator />
                        <motion.section variants={sectionVariants}>
                            <h3 className="mb-4 text-lg font-semibold">Complaint History</h3>
                            <div className="relative pl-8 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                                {historyData?.data.map((item, index) => (
                                    <div key={`${item.history_id}-${index}`} className="relative">
                                        <div className="absolute left-[-1.9rem] top-0 w-4 h-4 bg-green-600 rounded-full" />
                                        <div className="flex flex-row justify-between p-4 border rounded-lg border-border/50 bg-card">
                                            <p className="text-sm font-normal">{item.action_taken.replace(/_/g, ' ').toLowerCase().replace(/(^\w|\.\s*\w)/g, c => c.toUpperCase())}</p>
                                            <Badge variant="outline" className="text-xs">{new Date(item.action_date || '').toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};