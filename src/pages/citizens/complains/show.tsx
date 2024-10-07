import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContainer, DialogContent, DialogImage, DialogTrigger } from "@/components/ui/motion-dialog";
import { Separator } from "@/components/ui/separator";
import { TableType } from "@/types/dev.types";
import { supabaseClient } from "@/utility";
import { useList, useNavigation, useResource, useShow } from "@refinedev/core";
import { AlertCircle, DollarSign, Gavel, Home, MapPin, Paperclip, Phone, UserIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Icons for different complaint types (similar to create.tsx)
const complaintTypeIcons: Record<string, JSX.Element> = {
    "Civil Disputes Between Neighbors and Family Members": <UserIcon className="w-5 h-5 mr-2" />,
    "Collection of Debts": <DollarSign className="w-5 h-5 mr-2" />,
    "Issues Not Covered by Law or Public Order": <AlertCircle className="w-5 h-5 mr-2" />,
    "Disputes Involving Property": <Home className="w-5 h-5 mr-2" />,
    "Minor Criminal Offenses": <Gavel className="w-5 h-5 mr-2" />,
    "Conflicts Over Personal Relationships": <UserIcon className="w-5 h-5 mr-2" />,
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

    useEffect(() => {
        if (documentsData) {
            const urls = documentsData.data.reduce((acc, doc) => {
                const { data } = supabaseClient
                    .storage
                    .from('complaint_documents')
                    .getPublicUrl(doc.file_path);
                if (data?.publicUrl) {
                    acc[doc.file_name as keyof typeof acc] = data.publicUrl;
                }
                return acc;
            }, {} as Record<string, string>);
            setDocumentUrls(urls);
        }
    }, [documentsData]);

    console.log(documentUrls)


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl p-4 mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Complaint Details</h1>
                <div className="flex gap-2">
                    <Button onClick={() => list("complaints")}>Back to List</Button>
                    <Button onClick={() => edit("complaints", id ?? "")}>Edit</Button>
                </div>
            </div>
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Complaint Information section */}
                        <section>
                            <h3 className="mb-2 text-lg font-semibold">Complaint Information</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Case Number</p>
                                    <p>{record?.case_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <Badge>{record?.status}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date Filed</p>
                                    <p>{record?.date_filed ? new Date(record.date_filed).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Resolution Date</p>
                                    <p>{record?.resolution_date ? new Date(record.resolution_date).toLocaleDateString() : 'Not resolved yet'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Barangay</p>
                                    <p>{record?.barangay_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Complaint Type</p>
                                    <div className="flex items-center">
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
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Description</p>
                                    <p className="whitespace-pre-wrap">{record?.complaint_description}</p>
                                </div>
                            </div>
                        </section>
                        <Separator />
                        {/* Persons Involved section */}
                        <section>
                            <h3 className="mb-2 text-lg font-semibold">Persons Involved</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {participantsData?.data.map((participant: TableType<"complaint_participants"> & { people: TableType<"people"> }, index) => (
                                    <Card key={`${participant.people.first_name}-${index}`}>
                                        <CardContent className="flex items-center justify-between p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold">{`${participant.people.first_name} ${participant.people.last_name}`}</h3>
                                                    <Badge variant="outline">{participant.role}</Badge>
                                                </div>
                                                <div className="flex flex-row flex-wrap gap-2">
                                                    <p className="inline-flex text-sm text-gray-600"><MapPin className="w-4 h-4 mr-2" /> {participant.people.address}</p>
                                                    <p className="inline-flex text-sm text-gray-600"><Phone className="w-4 h-4 mr-2" /> {participant.people.contact_info}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                        <Separator />
                        {/* Complaint History section */}
                        <section>
                            <h3 className="mb-2 text-lg font-semibold">Complaint History</h3>
                            <div className="space-y-2">
                                {historyData?.data.map((item, index) => (
                                    <div key={`${item.history_id}-${index}`} className="p-2 border rounded">
                                        <p className="font-semibold">{item.action_taken}</p>
                                        <p className="text-sm text-gray-600">By: {item.action_by}</p>
                                        <p className="text-sm text-gray-600">Date: {new Date(item.action_date || '').toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <Separator />
                        {/* Attached Files section */}
                        <section>
                            <h3 className="mb-2 text-lg font-semibold">Attached Files</h3>
                            {documentsData?.data?.length ? (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {documentsData.data.map((file, index) => (
                                        <Dialog
                                            key={`${file.file_name}-${index}`}
                                            transition={{
                                                duration: 0.3,
                                                ease: 'easeInOut',
                                            }}
                                        >
                                            <DialogTrigger>
                                                <div className="flex items-center p-2 space-x-2 border rounded cursor-pointer">
                                                    <Paperclip className="w-4 h-4 text-gray-500" />
                                                    <span className="truncate hover:underline">
                                                        {file.file_name}
                                                    </span>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContainer>
                                                <DialogContent className='relative'>
                                                    <DialogImage
                                                        src={documentUrls?.[file.file_name]}
                                                        alt={file.file_name}
                                                        className='h-auto w-full max-w-[90vw] rounded-[4px] object-cover lg:h-[90vh]'
                                                    />
                                                </DialogContent>
                                                <DialogClose
                                                    className='fixed p-1 bg-white rounded-full right-6 top-6 h-fit w-fit'
                                                    variants={{
                                                        initial: { opacity: 0 },
                                                        animate: {
                                                            opacity: 1,
                                                            transition: { delay: 0.3, duration: 0.1 },
                                                        },
                                                        exit: { opacity: 0, transition: { duration: 0 } },
                                                    }}
                                                >
                                                    <XIcon className='w-5 h-5 text-zinc-500' />
                                                </DialogClose>
                                            </DialogContainer>
                                        </Dialog>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">No files attached</p>
                            )}
                        </section>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};