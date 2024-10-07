import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-input';
import { Dialog, DialogClose, DialogContainer, DialogContent, DialogTrigger } from "@/components/ui/motion-dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TableType } from "@/types/dev.types";
import { supabaseClient } from "@/utility";
import { useList, useNavigation, useResource, useShow } from "@refinedev/core";
import { AlertCircle, CloudUpload, DollarSign, FileIcon, Gavel, Home, MapPin, Paperclip, Phone, UserIcon, XIcon } from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { toast } from 'sonner';

const DialogImage = lazy(() => import('@/components/ui/motion-dialog').then(mod => ({ default: mod.DialogImage })));

const complaintTypeIcons: Record<string, JSX.Element> = {
    "Civil Disputes Between Neighbors and Family Members": <UserIcon className="w-4 h-4 mr-2" />,
    "Collection of Debts": <DollarSign className="w-4 h-4 mr-2" />,
    "Issues Not Covered by Law or Public Order": <AlertCircle className="w-4 h-4 mr-2" />,
    "Disputes Involving Property": <Home className="w-4 h-4 mr-2" />,
    "Minor Criminal Offenses": <Gavel className="w-4 h-4 mr-2" />,
    "Conflicts Over Personal Relationships": <UserIcon className="w-4 h-4 mr-2" />,
};

export const ComplainShow: React.FC = () => {
    const { edit, list } = useNavigation();
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

    console.log(historyData)

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
                            // Optional: further sanitize or validate the URL here
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

    const handleUpload = async () => {
        if (uploadedFiles.length === 0) {
            toast.error("Please select a file to upload.");
            return;
        }

        try {
            await Promise.all(uploadedFiles.map(async (file) => {
                const { data, error } = await supabaseClient
                    .storage
                    .from('complaint_documents')
                    .upload(`complaints/${id}/${file.name}`, file);

                if (error) {
                    throw error;
                }

                const { error: documentError } = await supabaseClient.from('complaint_documents').insert({
                    complaint_id: id,
                    file_name: file.name,
                    file_path: data.path,
                });

                if (documentError) {
                    throw documentError;
                }
            }));

            toast.success("Files uploaded successfully.");
            setUploadedFiles([]);
            // Optionally, refresh the documents list here
        } catch (err) {
            console.error("Error during file upload:", err);
            toast.error("Failed to upload files.");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl p-4 mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Complaint Details</h1>
                <div className="flex gap-2">
                    <Button onClick={() => list("complaints")}>Back to List</Button>
                </div>
            </div>
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Complaint Information section */}
                        <section>
                            <h3 className="mb-2 text-lg font-semibold">Complaint Information</h3>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Case Number</p>
                                    <p className="text-xs">{record?.case_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Status</p>
                                    <Badge className="text-xs">{record?.status}</Badge>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Date Filed</p>
                                    <p className="text-xs">{record?.date_filed ? new Date(record.date_filed).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Resolution Date</p>
                                    <p className="text-xs">{record?.resolution_date ? new Date(record.resolution_date).toLocaleDateString() : 'Not resolved yet'}</p>
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
                        </section>
                        <Separator />
                        {/* Case Details section */}
                        <section>
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
                        </section>
                        <Separator />
                        {/* Persons Involved section */}
                        <section>
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
                        </section>
                        <Separator />
                        {/* Attached Files section */}
                        <section>
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
                            <div className="mt-4">
                                <h3 className="mb-2 text-lg font-semibold">Upload Additional</h3>
                                <FileUploader
                                    value={uploadedFiles}
                                    onValueChange={(files) => setUploadedFiles(files || [])}
                                    dropzoneOptions={{
                                        accept: {
                                            'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
                                            'application/pdf': ['.pdf'],
                                            'video/*': ['.mp4', '.avi', '.mov'],
                                            'application/msword': ['.doc', '.docx'],
                                        },
                                        maxFiles: 5,
                                        maxSize: 10 * 1024 * 1024, // 10 MB
                                        multiple: true,
                                    }}
                                    className="relative p-1 rounded-lg bg-card"
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
                                        {uploadedFiles.map((file, index) => (
                                            <FileUploaderItem className="px-4 py-4" key={`${file.name}-${index}`} index={index}>
                                                <Paperclip className="w-4 h-4 stroke-current" />
                                                <span>{file.name}</span>
                                            </FileUploaderItem>
                                        ))}
                                    </FileUploaderContent>
                                </FileUploader>
                                <Button onClick={handleUpload} className="w-full mt-2">Upload Document</Button>
                            </div>
                        </section>
                        <Separator />
                        {/* Complaint History section */}
                        <section>
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
                        </section>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};