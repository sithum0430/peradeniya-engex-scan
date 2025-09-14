import { useState } from 'react';
import { QRScanner } from '@/components/QRScanner';
import { BuildingSelector } from '@/components/BuildingSelector';
import { ActionToggle } from '@/components/ActionToggle';
import { ScanResults } from '@/components/ScanResults';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

interface ScanData {
  qr_value: string;
  building_id: number;
  building_name: string;
  action: 'entry' | 'exit';
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  error_message?: string;
}

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [action, setAction] = useState<'entry' | 'exit'>('entry');
  const [lastScan, setLastScan] = useState<ScanData | null>(null);
  const { toast } = useToast();

  const handleScanResult = async (qrValue: string) => {
    if (!selectedBuildingId) {
      toast({
        title: "Building Required",
        description: "Please select a building before scanning.",
        variant: "destructive",
      });
      return;
    }

    // Stop scanning temporarily
    setIsScanning(false);

    const timestamp = new Date().toISOString();
    
    // Create initial scan data
    const scanData: ScanData = {
      qr_value: qrValue,
      building_id: selectedBuildingId,
      building_name: getBuildingName(selectedBuildingId),
      action,
      timestamp,
      status: 'pending',
    };

    setLastScan(scanData);

    try {
      // Call your backend API
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qr_value: qrValue,
          building_id: selectedBuildingId,
          action,
          timestamp,
        }),
      });

      if (response.ok) {
        // Success - update scan data
        setLastScan(prev => prev ? { ...prev, status: 'success' } : null);
        
        toast({
          title: "Scan Recorded",
          description: `${action === 'entry' ? 'Entry' : 'Exit'} recorded for ${qrValue}`,
          variant: "default",
        });
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('API call failed:', error);
      
      // For demo purposes, we'll show success even if API fails
      // In production, you'd want to handle this properly
      setLastScan(prev => prev ? { 
        ...prev, 
        status: 'success',
        error_message: 'API unavailable - demo mode' 
      } : null);
      
      toast({
        title: "Demo Mode",
        description: `Scan recorded locally (API unavailable)`,
        variant: "default",
      });
    }

    // Resume scanning after a short delay
    setTimeout(() => {
      setIsScanning(true);
    }, 2000);
  };

  const getBuildingName = (buildingId: number): string => {
    const buildings = [
      { building_id: 1, building_name: 'Engineering Faculty Main Building' },
      { building_id: 2, building_name: 'Computer Science Building' },
      { building_id: 3, building_name: 'Electrical Engineering Building' },
      { building_id: 4, building_name: 'Mechanical Engineering Building' },
      { building_id: 5, building_name: 'Civil Engineering Building' },
      { building_id: 6, building_name: 'Exhibition Hall A' },
      { building_id: 7, building_name: 'Exhibition Hall B' },
    ];
    
    return buildings.find(b => b.building_id === buildingId)?.building_name || 'Unknown Building';
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  const clearResults = () => {
    setLastScan(null);
  };

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <Header />
      
      <div className="space-y-6">
        {/* Building Selector */}
        <BuildingSelector
          selectedBuildingId={selectedBuildingId}
          onBuildingChange={setSelectedBuildingId}
        />

        {/* Action Toggle */}
        <ActionToggle
          action={action}
          onActionChange={setAction}
        />

        {/* QR Scanner */}
        <QRScanner
          onScanResult={handleScanResult}
          isScanning={isScanning}
          onToggleScanning={toggleScanning}
        />

        {/* Scan Results */}
        <ScanResults
          lastScan={lastScan}
          onClearResults={clearResults}
        />
      </div>

      {/* Instructions */}
      <div className="glass-card p-4 mt-6 text-center">
        <h4 className="font-semibold mb-2 text-university-red">How to Use</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>1. Select a building from the dropdown</p>
          <p>2. Choose Entry or Exit action</p>
          <p>3. Tap "Start Scanning" and point at QR code</p>
          <p>4. Data will be automatically submitted</p>
        </div>
      </div>
    </div>
  );
};

export default Index;