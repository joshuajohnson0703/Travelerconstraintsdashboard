import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import type { Traveler } from '../lib/mockData';

interface TravelerSidebarProps {
  travelers: Traveler[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TravelerSidebar({ travelers, selectedId, onSelect }: TravelerSidebarProps) {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4 overflow-y-auto">
      <h2 className="mb-4">Travelers</h2>
      <div className="space-y-2">
        {travelers.map(traveler => (
          <Card
            key={traveler.id}
            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
              selectedId === traveler.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onSelect(traveler.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {traveler.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate">{traveler.name}</p>
                <div className="flex gap-1 mt-1">
                  <Badge
                    variant={traveler.constraints.flexibility === 'strict' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {traveler.constraints.flexibility}
                  </Badge>
                  {traveler.constraints.budget.current > traveler.constraints.budget.max && (
                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                      Over Budget
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </aside>
  );
}
