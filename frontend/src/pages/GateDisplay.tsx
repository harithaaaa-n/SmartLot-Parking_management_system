import React, { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';

const GateDisplay = () => {
    const [url, setUrl] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        // Dynamic URL based on current environment
        const exitUrl = `${window.location.protocol}//${window.location.host}/exit`;
        setUrl(exitUrl);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0 pointer-events-none" />

            {/* Controls */}
            <div className="absolute top-4 right-4 z-50">
                <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="text-white hover:bg-white/10">
                    {isFullScreen ? <Minimize /> : <Maximize />}
                </Button>
            </div>

            <div className="z-10 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                        EXIT GATE
                    </h1>
                    <p className="text-xl text-gray-400">Scan to Pay & Exit</p>
                </div>

                <div className="bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                    {url && (
                        <QRCode
                            value={url}
                            size={300}
                            level="H"
                            className="w-full h-full"
                        />
                    )}
                </div>

                <div className="space-y-1">
                    <p className="font-mono text-sm text-gray-500">Gate ID: GATE-01</p>
                    <p className="text-xs text-gray-600">Smart Parking System</p>
                </div>
            </div>
        </div>
    );
};

export default GateDisplay;
