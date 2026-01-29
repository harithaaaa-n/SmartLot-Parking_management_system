import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Banknote } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { exitVehicle, ExitPreview } from "@/api/api";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { clearTicket } from "@/utils/storage";

const CashPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previewData = location.state as ExitPreview | null;

    if (!previewData) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-4">
                <p>Invalid Session. Please go back to Exit.</p>
                <Button onClick={() => navigate("/exit")}>Go Back</Button>
            </div>
        );
    }

    const exitMutation = useMutation({
        mutationFn: ({ entryId, actualSlotNumber }: { entryId: string, actualSlotNumber?: string }) => exitVehicle(entryId, actualSlotNumber),
        onMutate: () => showLoading("Verifying Cash Payment..."),
        onSuccess: (data, variables, toastId) => {
            dismissToast(toastId as string);
            showSuccess(`Cash Payment Verified!`);
            clearTicket();

            navigate("/payment-success", {
                state: {
                    vehicleNumber: previewData.vehicleNumber,
                    amount: previewData.amount,
                    paymentMode: 'CASH',
                    transactionId: `CASH${Date.now()}`
                }
            });
        },
        onError: (error, variables, toastId) => {
            dismissToast(toastId as string);
            showError(`Verification Failed: ${error.message}`);
        },
    });

    const handleConfirm = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
        exitMutation.mutate({ entryId: previewData.vehicleNumber, actualSlotNumber: previewData.actualSlotNumber });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-amber-500">
                    <CardHeader>
                        <Button variant="ghost" className="w-fit p-0 h-auto mb-2 hover:bg-transparent" onClick={() => navigate("/payment", { state: previewData })}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                            <Banknote className="h-6 w-6" />
                            Cash Payment
                        </CardTitle>
                        <CardDescription>Please proceed to the payment counter.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                            <Banknote className="h-12 w-12 text-amber-600" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Pay ₹{previewData.amount}</h3>
                            <p className="text-muted-foreground text-sm">
                                Hand over the cash to the booth operator. <br />
                                Once paid, click confirm below.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full py-6 text-lg bg-amber-600 hover:bg-amber-700 text-white"
                            disabled={exitMutation.isPending}
                            onClick={handleConfirm}
                        >
                            {exitMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                `Confirm Cash Received`
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default CashPayment;
