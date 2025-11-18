import { useState } from 'react';
import { mockTravelers } from '../lib/mockData';
import { TravelerSidebar } from './TravelerSidebar';
import { ConstraintForm } from './ConstraintForm';
import { FeasibilityPreview } from './FeasibilityPreview';

export function TravelerConstraints() {
  const [travelers, setTravelers] = useState(mockTravelers);
  const [selectedTravelerId, setSelectedTravelerId] = useState(travelers[0].id);
  const selectedTraveler = travelers.find(t => t.id === selectedTravelerId) || travelers[0];

  const updateTravelerConstraints = (travelerId: string, updatedConstraints: any) => {
    setTravelers(prev =>
      prev.map(t =>
        t.id === travelerId
          ? { ...t, constraints: { ...t.constraints, ...updatedConstraints } }
          : t
      )
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)]">
      {/* Left Sidebar - Traveler List */}
      <TravelerSidebar
        travelers={travelers}
        selectedId={selectedTravelerId}
        onSelect={setSelectedTravelerId}
      />

      {/* Center Panel - Constraint Forms */}
      <div className="flex-1 overflow-y-auto p-6">
        <ConstraintForm
          traveler={selectedTraveler}
          onUpdate={(constraints) => updateTravelerConstraints(selectedTravelerId, constraints)}
        />
      </div>

      {/* Right Panel - Feasibility Preview */}
      <FeasibilityPreview travelers={travelers} />
    </div>
  );
}
