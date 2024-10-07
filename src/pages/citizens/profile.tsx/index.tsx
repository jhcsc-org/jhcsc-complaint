import { Card, CardContent } from "@/components/ui/card";
import { useGetIdentity, useList, useOne } from "@refinedev/core";
import { User } from "@supabase/supabase-js";
import { MapPin, User as UserIcon } from "lucide-react";

export const UserProfileDashboard = () => {
  const { data: userData } = useGetIdentity<User>();
  const userId = userData?.id;
  const { data: profileData } = useOne({
    resource: "user_profile",
    id: userId,
    meta: {
      idColumnName: "user_id",
    },
    queryOptions: {
      enabled: !!userId,
    },
  });
  const profile = profileData?.data;

  const { data: complaintsData } = useList({
    resource: "complaints",
    filters: [
      {
        field: "filed_by",
        value: userId,
        operator: "eq",
      },
    ],
    queryOptions: {
      enabled: !!userId,
    },
  });

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl p-4 mx-auto">
      <Card>
        <CardContent className="p-6 space-y-6">
          <section>
            <h3 className="mb-2 text-lg font-semibold">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm">{`${profile.first_name} ${profile.middle_name} ${profile.last_name}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{profile.email}</p>
              </div>
            </div>
          </section>
          <section>
            <h3 className="mb-2 text-lg font-semibold">Address</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-xs">{profile.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <p className="text-xs">{`${profile.barangay_name}, ${profile.municipality_name}, ${profile.province_name}`}</p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};