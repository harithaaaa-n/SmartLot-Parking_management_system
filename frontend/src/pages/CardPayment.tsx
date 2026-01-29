import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, CreditCard } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { exitVehicle, ExitPreview } from "@/api/api";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { clearTicket } from "@/utils/storage";

const CardPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previewData = location.state as ExitPreview | null;

    // Form State
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [name, setName] = useState("");

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
        onMutate: () => showLoading("Processing Card Payment..."),
        onSuccess: (data, variables, toastId) => {
            dismissToast(toastId as string);
            showSuccess(`Payment Successful!`);
            clearTicket();

            navigate("/payment-success", {
                state: {
                    vehicleNumber: previewData.vehicleNumber,
                    amount: previewData.amount,
                    paymentMode: 'CARD',
                    transactionId: `CARD${Date.now()}`
                }
            });
        },
        onError: (error, variables, toastId) => {
            dismissToast(toastId as string);
            showError(`Payment Failed: ${error.message}`);
        },
    });

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        exitMutation.mutate({ entryId: previewData.vehicleNumber, actualSlotNumber: previewData.actualSlotNumber });
    };

    const isFormValid = cardNumber.length >= 16 && expiry.length >= 5 && cvv.length >= 3 && name.length > 0;

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
                            <CreditCard className="h-6 w-6 text-primary" />
                            Card Payment
                        </CardTitle>
                        <CardDescription>Enter your card details securely.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePayment} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Cardholder Name</Label>
                                <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="number">Card Number</Label>
                                <Input id="number" placeholder="0000 0000 0000 0000" maxLength={19} value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input id="expiry" placeholder="MM/YY" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input id="cvv" type="password" placeholder="123" maxLength={3} value={cvv} onChange={e => setCvv(e.target.value)} required />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full py-6 text-lg mt-4"
                                disabled={!isFormValid || exitMutation.isPending}
                            >
                                {exitMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${previewData.amount}`
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default CardPayment;
