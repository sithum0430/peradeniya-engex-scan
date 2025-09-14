import { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Building {
  building_id: number;
  building_name: string;
}

interface BuildingSelectorProps {
  selectedBuildingId: number | null;
  onBuildingChange: (buildingId: number) => void;
}

export const BuildingSelector = ({ selectedBuildingId, onBuildingChange }: BuildingSelectorProps) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // This will call your backend API
      const response = await fetch('/api/buildings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch buildings');
      }
      
      const data = await response.json();
      setBuildings(data);
    } catch (err) {
      console.error('Error fetching buildings:', err);
      setError('Could not load buildings. Using mock data for demo.');
      
      // Mock data for demonstration
      setBuildings([
        { building_id: 1, building_name: 'Engineering Faculty Main Building' },
        { building_id: 2, building_name: 'Computer Science Building' },
        { building_id: 3, building_name: 'Electrical Engineering Building' },
        { building_id: 4, building_name: 'Mechanical Engineering Building' },
        { building_id: 5, building_name: 'Civil Engineering Building' },
        { building_id: 6, building_name: 'Exhibition Hall A' },
        { building_id: 7, building_name: 'Exhibition Hall B' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    fetchBuildings();
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3 mb-4">
        <Building className="w-6 h-6 text-university-red" />
        <h3 className="text-lg font-semibold">Select Building</h3>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded-lg"></div>
        </div>
      ) : (
        <>
          <Select
            value={selectedBuildingId?.toString() || ""}
            onValueChange={(value) => onBuildingChange(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a building..." />
            </SelectTrigger>
            <SelectContent className="glass-card border-border/50">
              {buildings.map((building) => (
                <SelectItem 
                  key={building.building_id} 
                  value={building.building_id.toString()}
                  className="hover:bg-university-gold/10"
                >
                  {building.building_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm mb-2">{error}</p>
              <Button 
                onClick={retryFetch} 
                variant="outline" 
                size="sm"
                className="h-8 text-xs"
              >
                Retry Connection
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};