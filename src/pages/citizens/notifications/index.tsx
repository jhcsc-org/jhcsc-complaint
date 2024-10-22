import { TableType } from "@/types/dev.types";
import { HttpError, useList, useNavigation } from "@refinedev/core";
import { motion } from "framer-motion";
import { useState } from "react";

export const CitizenNotificationView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isFetching } = useList<TableType<"citizen_notifications_view">, HttpError, TableType<"citizen_notifications_view"> & { total: number }>({
        resource: "citizen_notifications_view",
        liveMode: "auto",
        pagination: { pageSize: 10 }
    });
    const { show } = useNavigation();

    const listVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="max-w-4xl min-h-screen p-4 mx-auto">
            <h2 className="flex flex-row items-center gap-2 pb-4 mb-4 text-3xl font-bold border-b">
                Recent Updates</h2>
            {isFetching ? (
                <motion.div
                    className="flex items-center justify-center h-64 text-sm"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                >
                    Loading...
                </motion.div>
            ) : data?.data.length === 0 ? (
                <motion.div
                    className="flex items-center justify-center h-64 text-sm"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                >
                    No Recent Updates
                </motion.div>
            ) : (
                <ul className="space-y-4">
                    {data!.data.map((notification, index) => (
                        <motion.li 
                            key={index} 
                            className="p-4 transition-shadow border rounded-lg cursor-pointer bg-card hover:bg-muted-foreground-5 hover:text-blue-600 hover:border-blue-500/25"
                            onClick={() => show("complaints", notification.complaint_id!)}
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            aria-label={`Notification for case number ${notification.case_number}`}
                        >
                            <p>
                                {notification.notification!.replace("IN_PROCESS", "IN PROCESS")}
                            </p>
                            <span className="block mt-1 text-sm text-gray-500">
                                {new Date(notification.action_date as string).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </span>
                        </motion.li>
                    ))}
                </ul>
            )}
        </div>
    );
};