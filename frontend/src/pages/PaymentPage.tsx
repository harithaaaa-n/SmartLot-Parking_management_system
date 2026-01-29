import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Banknote, QrCode, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { exitVehicle, ExitPreview } from "@/api/api";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { clearTicket } from "@/utils/storage";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previewData = location.state as ExitPreview | null;
    const [paymentMode, setPaymentMode] = useState<'UPI' | 'CARD' | 'CASH' | null>(null);

    // Redirect if no data (direct access protection)
    if (!previewData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Invalid Session. Please go back to Exit.</p>
                <Button onClick={() => navigate("/exit")} className="ml-4">Go Back</Button>
            </div>
        );
    }

    const handlePayment = async () => {
        if (!paymentMode) return;

        switch (paymentMode) {
            case 'UPI':
                navigate("/payment/upi", { state: previewData });
                break;
            case 'CARD':
                navigate("/payment/card", { state: previewData });
                break;
            case 'CASH':
                navigate("/payment/cash", { state: previewData });
                break;
        }
    };



    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl border-t-4 border-green-500">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-3">
                            <Banknote className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Secure Payment</CardTitle>
                        <CardDescription>
                            Complete payment to open the exit gate.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Bill Summary */}
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Vehicle Number</span>
                                <span className="font-mono font-bold">{previewData.vehicleNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration</span>
                                <span>{previewData.durationMinutes} mins</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-300 dark:border-gray-700 pt-2 mt-2">
                                <span className="font-semibold text-lg">Total Amount</span>
                                <span className="font-bold text-xl text-primary">₹{previewData.amount}</span>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">Select Payment Method</p>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => setPaymentMode('UPI')}
                                    className={`p-3 border rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${paymentMode === 'UPI' ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                >
                                    <QrCode className="h-6 w-6" />
                                    <span className="text-xs font-semibold">UPI</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMode('CARD')}
                                    className={`p-3 border rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${paymentMode === 'CARD' ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                >
                                    <CreditCard className="h-6 w-6" />
                                    <span className="text-xs font-semibold">Card</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMode('CASH')}
                                    className={`p-3 border rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${paymentMode === 'CASH' ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                >
                                    <Banknote className="h-6 w-6" />
                                    <span className="text-xs font-semibold">Cash</span>
                                </button>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handlePayment}
                            className="w-full py-6 text-lg font-semibold bg-green-600 hover:bg-green-700"
                            disabled={!paymentMode}
                        >
                            {`Proceed to ${paymentMode ? paymentMode + ' Payment' : 'Pay'}`}
                        </Button>
                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentPage;
