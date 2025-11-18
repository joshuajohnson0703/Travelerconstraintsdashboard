import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, DollarSign, Calendar, Users } from 'lucide-react';
import type { Traveler } from '../lib/mockData';

interface FeasibilityPreviewProps {
  travelers: Traveler[];
}

export function FeasibilityPreview({ travelers }: FeasibilityPreviewProps) {
  // Calculate conflicts
  const conflicts: { type: string; message: string; severity: 'error' | 'warning' }[] = [];

  // Check budget conflicts
  travelers.forEach(traveler => {
    if (traveler.constraints.budget.current > traveler.constraints.budget.max) {
      conflicts.push({
        type: 'budget',
        message: `${traveler.name}'s budget exceeded by $${(
          traveler.constraints.budget.current - traveler.constraints.budget.max
        ).toLocaleString()}`,
        severity: 'error'
      });
    }
  });

  // Check date conflicts
  const cannotTravelDates = travelers.flatMap(t =>
    t.constraints.nonNegotiables.cannotTravel.map(date => ({
      traveler: t.name,
      date
    }))
  );

  cannotTravelDates.forEach(({ traveler, date }) => {
    conflicts.push({
      type: 'date',
      message: `${traveler} cannot travel on ${date}`,
      severity: 'warning'
    });
  });

  // Check visa restrictions
  travelers.forEach(traveler => {
    if (traveler.constraints.passportVisa.restrictions.length > 0) {
      conflicts.push({
        type: 'visa',
        message: `${traveler.name} has visa restrictions: ${traveler.constraints.passportVisa.restrictions.join(', ')}`,
        severity: 'warning'
      });
    }
  });

  // Calculate feasibility stats
  const totalTravelers = travelers.length;
  const strictTravelers = travelers.filter(t => t.constraints.flexibility === 'strict').length;
  const averageBudget = travelers.reduce((sum, t) => sum + t.constraints.budget.max, 0) / totalTravelers;
  const commonCities = travelers.reduce((cities: string[], t) => {
    t.constraints.nonNegotiables.mustVisit.forEach(city => {
      if (!cities.includes(city)) cities.push(city);
    });
    return cities;
  }, []);

  return (
    <aside className="w-96 border-l border-slate-200 bg-white p-4 overflow-y-auto">
      <h2 className="mb-4">Feasibility Preview</h2>

      {/* Real-time Status */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {conflicts.filter(c => c.severity === 'error').length === 0 ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            Overall Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conflicts.filter(c => c.severity === 'error').length === 0 ? (
            <p className="text-green-600">Trip is feasible with current constraints</p>
          ) : (
            <p className="text-red-600">
              {conflicts.filter(c => c.severity === 'error').length} critical issue(s) detected
            </p>
          )}
        </CardContent>
      </Card>

      {/* Group Statistics */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Group Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-sm">Total Travelers</span>
            </div>
            <Badge>{totalTravelers}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-500" />
              <span className="text-sm">Strict Constraints</span>
            </div>
            <Badge variant={strictTravelers > 0 ? 'destructive' : 'secondary'}>
              {strictTravelers}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <span className="text-sm">Avg. Budget</span>
            </div>
            <Badge variant="outline">${averageBudget.toLocaleString()}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm">Must-Visit Cities</span>
            </div>
            <Badge variant="outline">{commonCities.length}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Active Conflicts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {conflicts.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">No conflicts detected</span>
            </div>
          ) : (
            conflicts.map((conflict, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 p-3 rounded-lg ${
                  conflict.severity === 'error'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}
              >
                {conflict.severity === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{conflict.message}</p>
                  <Badge
                    variant={conflict.severity === 'error' ? 'destructive' : 'outline'}
                    className="mt-1 text-xs"
                  >
                    {conflict.type}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Must-Visit Cities Summary */}
      {commonCities.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Required Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {commonCities.map(city => (
                <Badge key={city} variant="secondary">
                  {city}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
