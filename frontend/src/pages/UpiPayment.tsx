import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, QrCode } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { exitVehicle, ExitPreview } from "@/api/api";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { clearTicket } from "@/utils/storage";

const UpiPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previewData = location.state as ExitPreview | null;
    const [selectedApp, setSelectedApp] = useState<string | null>(null);

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
        onMutate: () => showLoading("Processing UPI Payment..."),
        onSuccess: (data, variables, toastId) => {
            dismissToast(toastId as string);
            showSuccess(`Payment Successful via ${selectedApp}!`);
            clearTicket();

            navigate("/payment-success", {
                state: {
                    vehicleNumber: previewData.vehicleNumber,
                    amount: previewData.amount,
                    paymentMode: `UPI (${selectedApp})`,
                    transactionId: `UPI${Date.now()}`
                }
            });
        },
        onError: (error, variables, toastId) => {
            dismissToast(toastId as string);
            showError(`Payment Failed: ${error.message}`);
        },
    });

    const handlePayment = async () => {
        if (!selectedApp) return;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        exitMutation.mutate({ entryId: previewData.vehicleNumber, actualSlotNumber: previewData.actualSlotNumber });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader>
                        <Button variant="ghost" className="w-fit p-0 h-auto mb-2 hover:bg-transparent" onClick={() => navigate("/payment", { state: previewData })}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-6 w-6 text-primary" />
                            UPI Payment
                        </CardTitle>
                        <CardDescription>Select your preferred UPI app to pay ₹{previewData.amount}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {['Google Pay', 'PhonePe', 'Paytm', 'WhatsApp Pay'].map((app) => (
                                <div
                                    key={app}
                                    onClick={() => setSelectedApp(app)}
                                    className={`p-4 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedApp === app ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}
                                >
                                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2 text-xs font-bold text-gray-500">
                                        {app[0]}Pay
                                    </div>
                                    <span className="text-sm font-medium">{app}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full py-6 text-lg"
                            disabled={!selectedApp || exitMutation.isPending}
                            onClick={handlePayment}
                        >
                            {exitMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay with ${selectedApp || '...'}`
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default UpiPayment;
