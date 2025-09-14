import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScanResult: (result: string) => void;
  isScanning: boolean;
  onToggleScanning: () => void;
}

export const QRScanner = ({ onScanResult, isScanning, onToggleScanning }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setError('Camera permission denied. Please allow camera access.');
        setHasPermission(false);
      }
    };

    checkPermissions();
  }, []);

  useEffect(() => {
    if (!isScanning || !hasPermission) return;

    const startScanning = async () => {
      try {
        if (!readerRef.current) {
          readerRef.current = new BrowserMultiFormatReader();
        }

        const videoInputDevices = await readerRef.current.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          setError('No camera found on this device.');
          return;
        }

        // Try to use back camera first (usually better for QR scanning)
        const backCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        
        const selectedDeviceId = backCamera?.deviceId || videoInputDevices[0].deviceId;

        await readerRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, error) => {
            if (result) {
              onScanResult(result.getText());
            }
          }
        );

        setError('');
      } catch (err) {
        console.error('Scanner error:', err);
        setError('Failed to start camera. Please check permissions.');
      }
    };

    startScanning();

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [isScanning, hasPermission, onScanResult]);

  if (!hasPermission) {
    return (
      <div className="glass-card p-8 text-center">
        <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
        <p className="text-muted-foreground mb-4">
          Please allow camera access to scan QR codes
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry Permission
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <div className="scanner-container mb-4">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <Square className="w-24 h-24 mx-auto mb-4" />
              <p className="text-lg">Ready to scan</p>
            </div>
          </div>
        )}
        
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-8 border-2 border-university-gold rounded-lg animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-48 h-48 border-2 border-university-gold rounded-lg" />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onToggleScanning}
          variant={isScanning ? "destructive" : "default"}
          size="lg"
          className="w-full max-w-xs"
        >
          <Camera className="w-5 h-5 mr-2" />
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};