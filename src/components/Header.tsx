import universityLogo from '@/assets/university-logo.png';
import engexLogo from '@/assets/engex-logo.png';

export const Header = () => {
  return (
    <header className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={universityLogo} 
            alt="University of Peradeniya" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold bg-gradient-university bg-clip-text text-transparent">
              QR Scanner
            </h1>
            <p className="text-sm text-muted-foreground">
              Exhibition Crowd Management
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <img 
            src={engexLogo} 
            alt="EngEX Exhibition" 
            className="w-20 h-12 object-contain"
          />
          <div className="text-right">
            <p className="text-sm font-semibold text-university-gold">
              EngEX 2024
            </p>
            <p className="text-xs text-muted-foreground">
              75th Anniversary
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};