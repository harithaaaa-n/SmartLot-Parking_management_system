import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Receipt } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { vehicleNumber, amount, paymentMode, transactionId } = location.state || {};

    // Clear the active ticket from storage upon successful payment
    useEffect(() => {
        import("@/utils/storage").then(mod => mod.clearTicket());
    }, []);

    if (!vehicleNumber) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card className="shadow-2xl border-t-4 border-green-500 overflow-hidden">
                        <div className="bg-green-500 p-6 flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="bg-white p-4 rounded-full"
                            >
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </motion.div>
                        </div>

                        <CardHeader className="text-center pt-8">
                            <CardTitle className="text-3xl font-bold text-green-700">Payment Successful</CardTitle>
                            <p className="text-muted-foreground mt-2">
                                Your transaction has been processed securely.
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Transaction ID</span>
                                    <span className="font-mono text-xs font-medium">{transactionId || `TXN${Math.floor(Math.random() * 1000000)}`}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Vehicle Number</span>
                                    <span className="font-bold text-lg">{vehicleNumber}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Payment Mode</span>
                                    <span className="font-semibold">{paymentMode}</span>
                                </div>
                                <div className="border-t my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-semibold">Amount Paid</span>
                                    <span className="text-2xl font-bold text-primary">₹{amount}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                                <p className="text-blue-800 dark:text-blue-200 font-medium">
                                    Gate Opening... 🚧 🚗
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                                    You can now exit the parking lot.
                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3 pb-8">
                            <Button className="w-full h-12 text-lg" onClick={() => navigate("/")}>
                                <Home className="mr-2 h-5 w-5" />
                                Return to Home
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
