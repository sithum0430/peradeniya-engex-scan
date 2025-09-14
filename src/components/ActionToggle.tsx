import { LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Action = 'entry' | 'exit';

interface ActionToggleProps {
  action: Action;
  onActionChange: (action: Action) => void;
}

export const ActionToggle = ({ action, onActionChange }: ActionToggleProps) => {
  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">Action Type</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={action === 'entry' ? 'default' : 'outline'}
          onClick={() => onActionChange('entry')}
          className={`flex items-center gap-2 h-12 transition-all ${
            action === 'entry' 
              ? 'bg-university-gold text-foreground shadow-lg scale-105' 
              : 'hover:bg-university-gold/10'
          }`}
        >
          <LogIn className="w-5 h-5" />
          Entry
        </Button>
        
        <Button
          variant={action === 'exit' ? 'default' : 'outline'}
          onClick={() => onActionChange('exit')}
          className={`flex items-center gap-2 h-12 transition-all ${
            action === 'exit' 
              ? 'bg-university-red text-primary-foreground shadow-lg scale-105' 
              : 'hover:bg-university-red/10'
          }`}
        >
          <LogOut className="w-5 h-5" />
          Exit
        </Button>
      </div>

      <div className="mt-3 text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          action === 'entry' 
            ? 'bg-university-gold/20 text-university-gold-light' 
            : 'bg-university-red/20 text-university-red-light'
        }`}>
          {action === 'entry' ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
          {action === 'entry' ? 'Recording Entries' : 'Recording Exits'}
        </div>
      </div>
    </div>
  );
};