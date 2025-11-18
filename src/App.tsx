import { useState } from 'react';
import { TravelerConstraints } from './components/TravelerConstraints';
import { TripFeasibilityMap } from './components/TripFeasibilityMap';
import { ConflictResolution } from './components/ConflictResolution';
import { Button } from './components/ui/button';
import { MapPin, Users, AlertCircle } from 'lucide-react';

type Screen = 'constraints' | 'feasibility' | 'conflicts';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('constraints');
  const [conflicts, setConflicts] = useState<any[]>([
    {
      id: 1,
      title: "Kyoto → Osaka leg conflicts with David's PTO window.",
      severity: 'high',
      affectedTravelers: ['David'],
      type: 'date'
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="mb-4">Group Travel Planner</h1>
          <nav className="flex gap-2">
            <Button
              variant={currentScreen === 'constraints' ? 'default' : 'outline'}
              onClick={() => setCurrentScreen('constraints')}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Traveler Constraints
            </Button>
            <Button
              variant={currentScreen === 'feasibility' ? 'default' : 'outline'}
              onClick={() => setCurrentScreen('feasibility')}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              Trip Feasibility
            </Button>
            <Button
              variant={currentScreen === 'conflicts' ? 'default' : 'outline'}
              onClick={() => setCurrentScreen('conflicts')}
              className="gap-2 relative"
            >
              <AlertCircle className="w-4 h-4" />
              Resolve Conflicts
              {conflicts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conflicts.length}
                </span>
              )}
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto">
        {currentScreen === 'constraints' && <TravelerConstraints />}
        {currentScreen === 'feasibility' && <TripFeasibilityMap />}
        {currentScreen === 'conflicts' && <ConflictResolution conflicts={conflicts} setConflicts={setConflicts} />}
      </main>
    </div>
  );
}
