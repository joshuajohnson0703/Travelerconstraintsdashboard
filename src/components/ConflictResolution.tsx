import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Plane, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react';

interface ConflictResolutionProps {
  conflicts: any[];
  setConflicts: (conflicts: any[]) => void;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  impact: {
    cost: number;
    time: number;
    satisfaction: number;
  };
  type: 'date' | 'city' | 'budget' | 'transport';
}

export function ConflictResolution({ conflicts, setConflicts }: ConflictResolutionProps) {
  const [selectedConflict, setSelectedConflict] = useState(conflicts[0] || null);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);

  const solutions: Solution[] = [
    {
      id: '1',
      title: 'Shift Kyoto dates by 2 days',
      description: 'Move Kyoto visit from Feb 1-3 to Jan 30 - Feb 1, avoiding David\'s PTO conflict',
      impact: {
        cost: 0,
        time: 0,
        satisfaction: 5
      },
      type: 'date'
    },
    {
      id: '2',
      title: 'Replace Kyoto with Nara',
      description: 'Visit Nara instead of Kyoto for 2 days, keeping within David\'s availability',
      impact: {
        cost: -200,
        time: -1,
        satisfaction: -10
      },
      type: 'city'
    },
    {
      id: '3',
      title: 'Add buffer day in Osaka',
      description: 'Extend Osaka stay by 1 day to provide flexibility in travel schedule',
      impact: {
        cost: 150,
        time: 1,
        satisfaction: 15
      },
      type: 'date'
    },
    {
      id: '4',
      title: 'Use Shinkansen instead of flight',
      description: 'Take bullet train from Tokyo to Kyoto to reduce costs and increase flexibility',
      impact: {
        cost: -320,
        time: 2,
        satisfaction: 10
      },
      type: 'transport'
    }
  ];

  const handleApplyFix = (solution: Solution) => {
    // Remove the current conflict
    setConflicts(conflicts.filter(c => c.id !== selectedConflict?.id));
    // In a real app, this would update the route and recalculate feasibility
    alert(`Applied: ${solution.title}\n\nThe route has been updated and feasibility recalculated.`);
  };

  if (!selectedConflict) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)] p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              No Conflicts Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              All traveler constraints are satisfied. Your trip is ready to be booked!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top Banner - Conflict Summary */}
      <Card className="mb-6 bg-amber-50 border-amber-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
              <div>
                <CardTitle className="text-amber-900">Conflict Detected</CardTitle>
                <p className="text-amber-700 mt-1">{selectedConflict.title}</p>
              </div>
            </div>
            <Badge variant="destructive" className="text-sm">
              {selectedConflict.severity === 'high' ? 'High Priority' : 'Medium Priority'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-amber-800">
                Affected: {selectedConflict.affectedTravelers.join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="text-amber-800">Route: Kyoto → Osaka</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Middle Area - Suggested Fixes */}
        <div className="lg:col-span-2 space-y-4">
          <h2>Suggested Solutions</h2>
          {solutions.map(solution => (
            <Card
              key={solution.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedSolution === solution.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedSolution(solution.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {solution.type === 'date' && <Calendar className="w-5 h-5 text-blue-500" />}
                      {solution.type === 'city' && <MapPin className="w-5 h-5 text-blue-500" />}
                      {solution.type === 'budget' && <DollarSign className="w-5 h-5 text-blue-500" />}
                      {solution.type === 'transport' && <Plane className="w-5 h-5 text-blue-500" />}
                      {solution.title}
                    </CardTitle>
                    <p className="text-slate-600 text-sm">{solution.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">
                      {solution.impact.cost > 0 ? '+' : ''}${solution.impact.cost}
                    </span>
                    {solution.impact.cost > 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : solution.impact.cost < 0 ? (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">
                      {solution.impact.time > 0 ? '+' : ''}{solution.impact.time} days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Satisfaction:</span>
                    <Badge
                      variant={solution.impact.satisfaction >= 0 ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {solution.impact.satisfaction > 0 ? '+' : ''}{solution.impact.satisfaction}%
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyFix(solution);
                  }}
                  className="w-full"
                  variant={selectedSolution === solution.id ? 'default' : 'outline'}
                >
                  Apply This Fix
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Panel - Projected Changes */}
        <div className="space-y-4">
          <h2>Impact Preview</h2>
          
          {selectedSolution ? (() => {
            const solution = solutions.find(s => s.id === selectedSolution);
            if (!solution) return null;

            return (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Before & After</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Budget Comparison */}
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Total Budget</p>
                      <div className="flex items-center justify-between">
                        <span>$4,700</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className={solution.impact.cost > 0 ? 'text-red-600' : 'text-green-600'}>
                          ${4700 + solution.impact.cost}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Time Comparison */}
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Trip Duration</p>
                      <div className="flex items-center justify-between">
                        <span>12 days</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span>{12 + solution.impact.time} days</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Satisfaction Comparison */}
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Group Satisfaction</p>
                      <div className="flex items-center justify-between">
                        <span>75%</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className={solution.impact.satisfaction >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {75 + solution.impact.satisfaction}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">All date conflicts resolved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Within budget limits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">All must-visit cities included</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          })() : (
            <Card>
              <CardContent className="py-8 text-center text-slate-500">
                Select a solution to see projected changes
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
