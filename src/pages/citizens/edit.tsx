import { Button } from "@/components/ui/button";
import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export const CitizenEdit = () => {
    const { list } = useNavigation();

    const {
        refineCore: { onFinish, formLoading, query },
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const citizensData = query?.data?.data;

    return (
        <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>Citizen Edit</h1>
                <div>
                    <Button
                        onClick={() => {
                            list("citizens");
                        }}
                    >
                        Citizens
                    </Button>
                </div>
            </div>
            <form onSubmit={handleSubmit(onFinish)}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <div>
                        <input type="submit" value="Save" />
                    </div>
                </div>
            </form>
        </div>
    );
};
