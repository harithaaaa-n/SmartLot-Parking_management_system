import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

const MobileEntrySection = () => {
    const entryUrl = `${window.location.origin}/entry`;

    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 relative z-10">

                    <div className="space-y-6 text-center md:text-left max-w-lg">
                        <div className="inline-block px-3 py-1 rounded-full bg-[#0A1F44]/5 text-[#0A1F44] text-xs font-bold uppercase tracking-wider mb-2">
                            Instant Access
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-[#0A1F44] dark:text-white leading-tight">
                            Touchless Entry via <span className="text-[#00E5A8]">Mobile</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            Don't want to type? Simply scan this QR code with your smartphone to instantly access the vehicle entry page.
                            <br /><span className="font-semibold text-[#0A1F44]">Perfect for drivers arriving at the gate.</span>
                        </p>
                    </div>

                    <Card className="w-fit shadow-2xl border-0 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5A8] to-[#00C2FF] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <CardHeader className="text-center pb-2 relative z-10">
                            <div className="mx-auto bg-[#0A1F44] p-3 rounded-full w-fit mb-3 shadow-lg group-hover:scale-110 transition-transform">
                                <Smartphone className="h-6 w-6 text-[#00E5A8]" />
                            </div>
                            <CardTitle className="text-xl font-bold text-[#0A1F44]">Scan to Enter</CardTitle>
                            <CardDescription className="text-xs font-mono bg-gray-100 rounded px-2 py-1 mt-1 inline-block">
                                {entryUrl}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center p-8 pt-2 relative z-10">
                            <div className="p-3 bg-white rounded-xl shadow-inner">
                                <QRCode
                                    value={entryUrl}
                                    size={180}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </section>
    );
};

export default MobileEntrySection;
