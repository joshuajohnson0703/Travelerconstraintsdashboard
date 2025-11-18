import { useState } from 'react';
import { mockCities, mockRoutes } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Clock, DollarSign, AlertTriangle } from 'lucide-react';

export function TripFeasibilityMap() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [routes, setRoutes] = useState(mockRoutes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'feasible':
        return 'bg-green-500';
      case 'partial':
        return 'bg-amber-500';
      case 'infeasible':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'feasible':
        return <Badge className="bg-green-500">Feasible</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500">Partial Conflicts</Badge>;
      case 'infeasible':
        return <Badge variant="destructive">Infeasible</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)]">
      {/* Left Sidebar - Route List */}
      <aside className="w-80 border-r border-slate-200 bg-white p-4 overflow-y-auto">
        <h2 className="mb-4">Proposed Routes</h2>
        <div className="space-y-3">
          {routes.map(route => (
            <Card
              key={route.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRoute === route.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedRoute(route.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {route.cities.map((city, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-sm">{city}</span>
                          {index < route.cities.length - 1 && (
                            <span className="mx-1 text-slate-400">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(route.status)}`} />
                </div>
                <div>{getStatusBadge(route.status)}</div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="w-4 h-4" />
                  ${route.totalCost.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  {route.travelTime} days
                </div>
                {route.conflicts.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-amber-600">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <div className="flex-1">
                      <p>{route.conflicts.length} conflict(s)</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </aside>

      {/* Center - Map View */}
      <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h2 className="mb-4">Trip Feasibility Map</h2>

          {/* Map Container */}
          <Card className="mb-6 h-96 relative overflow-hidden">
            <CardContent className="p-0 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-slate-100">
                {/* SVG Map Visualization */}
                <svg className="w-full h-full" viewBox="0 0 800 400">
                  {/* City Markers */}
                  {mockCities.map((city, index) => {
                    const x = 150 + index * 150;
                    const y = 150 + (index % 2) * 100;
                    return (
                      <g key={city.id}>
                        <circle
                          cx={x}
                          cy={y}
                          r="8"
                          className="fill-blue-500 stroke-white stroke-2 cursor-pointer hover:fill-blue-600"
                        />
                        <text
                          x={x}
                          y={y + 25}
                          textAnchor="middle"
                          className="text-sm fill-slate-700"
                        >
                          {city.name}
                        </text>
                        <text
                          x={x}
                          y={y + 40}
                          textAnchor="middle"
                          className="text-xs fill-slate-500"
                        >
                          ${city.avgCost}
                        </text>
                      </g>
                    );
                  })}

                  {/* Route Lines */}
                  {selectedRoute && (() => {
                    const route = routes.find(r => r.id === selectedRoute);
                    if (!route) return null;
                    
                    return route.cities.map((cityName, index) => {
                      if (index === route.cities.length - 1) return null;
                      const cityIndex = mockCities.findIndex(c => c.name === cityName);
                      const nextCityIndex = mockCities.findIndex(c => c.name === route.cities[index + 1]);
                      
                      const x1 = 150 + cityIndex * 150;
                      const y1 = 150 + (cityIndex % 2) * 100;
                      const x2 = 150 + nextCityIndex * 150;
                      const y2 = 150 + (nextCityIndex % 2) * 100;
                      
                      return (
                        <line
                          key={index}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          className={`stroke-2 ${
                            route.status === 'feasible'
                              ? 'stroke-green-500'
                              : route.status === 'partial'
                              ? 'stroke-amber-500'
                              : 'stroke-red-500'
                          }`}
                          strokeDasharray="5,5"
                        />
                      );
                    });
                  })()}
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Selected Route Details */}
          {selectedRoute && (() => {
            const route = routes.find(r => r.id === selectedRoute);
            if (!route) return null;

            return (
              <Card>
                <CardHeader>
                  <CardTitle>Route Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600">Total Cost</p>
                      <p className="text-xl">${route.totalCost.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600">Travel Time</p>
                      <p className="text-xl">{route.travelTime} days</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600">Status</p>
                      <div>{getStatusBadge(route.status)}</div>
                    </div>
                  </div>

                  {route.conflicts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-slate-600">Conflicts</p>
                      <div className="space-y-2">
                        {route.conflicts.map((conflict, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                            <p className="text-sm flex-1">{conflict}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-slate-600">City Breakdown</p>
                    <div className="space-y-2">
                      {route.cities.map((cityName, index) => {
                        const city = mockCities.find(c => c.name === cityName);
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-500" />
                              <div>
                                <p>{city?.name}</p>
                                <p className="text-sm text-slate-600">{city?.country}</p>
                              </div>
                            </div>
                            <Badge variant="outline">${city?.avgCost}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
