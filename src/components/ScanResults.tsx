import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScanData {
  qr_value: string;
  building_id: number;
  building_name: string;
  action: 'entry' | 'exit';
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  error_message?: string;
}

interface ScanResultsProps {
  lastScan: ScanData | null;
  onClearResults: () => void;
}

export const ScanResults = ({ lastScan, onClearResults }: ScanResultsProps) => {
  if (!lastScan) {
    return (
      <div className="glass-card p-6 text-center">
        <User className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No scans yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Scan a QR code to see results here
        </p>
      </div>
    );
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = () => {
    switch (lastScan.status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-destructive" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-university-gold animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (lastScan.status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-destructive/10 border-destructive/20';
      case 'pending':
        return 'bg-university-gold/10 border-university-gold/20';
    }
  };

  const getActionColor = () => {
    return lastScan.action === 'entry' 
      ? 'bg-university-gold text-foreground' 
      : 'bg-university-red text-primary-foreground';
  };

  return (
    <div className={`glass-card p-4 border-2 ${getStatusColor()} animate-fade-in`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-lg">
              {lastScan.status === 'success' ? 'Scan Recorded' : 
               lastScan.status === 'pending' ? 'Processing...' : 'Scan Failed'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatTime(lastScan.timestamp)}
            </p>
          </div>
        </div>
        
        <Button
          onClick={onClearResults}
          variant="ghost"
          size="sm"
          className="opacity-70 hover:opacity-100"
        >
          Clear
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
          <User className="w-5 h-5 text-university-red" />
          <div>
            <p className="text-sm font-medium">QR Code</p>
            <p className="font-mono text-lg">{lastScan.qr_value}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
          <Building className="w-5 h-5 text-university-red" />
          <div>
            <p className="text-sm font-medium">Building</p>
            <p className="text-lg">{lastScan.building_name}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-university-red" />
            <div>
              <p className="text-sm font-medium">Action</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getActionColor()}`}>
                {lastScan.action.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {lastScan.error_message && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm font-medium">
              Error: {lastScan.error_message}
            </p>
          </div>
        )}

        {lastScan.status === 'success' && (
          <div className="text-center text-green-600 font-medium text-sm">
            ✓ Successfully recorded in system
          </div>
        )}
      </div>
    </div>
  );
};