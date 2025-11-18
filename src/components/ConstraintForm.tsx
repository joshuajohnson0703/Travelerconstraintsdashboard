import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { CalendarIcon, DollarSign, Plane, MapPin, X } from 'lucide-react';
import type { Traveler } from '../lib/mockData';

interface ConstraintFormProps {
  traveler: Traveler;
  onUpdate: (constraints: any) => void;
}

export function ConstraintForm({ traveler, onUpdate }: ConstraintFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    traveler.constraints.dateAvailability.start || undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    traveler.constraints.dateAvailability.end || undefined
  );
  const [budgetMax, setBudgetMax] = useState(traveler.constraints.budget.max);
  const [passportStatus, setPassportStatus] = useState(traveler.constraints.passportVisa.status);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>(
    traveler.constraints.airlinePreferences
  );
  const [mustVisit, setMustVisit] = useState(traveler.constraints.nonNegotiables.mustVisit);
  const [cannotTravel, setCannotTravel] = useState(traveler.constraints.nonNegotiables.cannotTravel);
  const [flexibility, setFlexibility] = useState(traveler.constraints.flexibility);

  const airlines = ['Delta', 'United', 'American', 'ANA', 'JAL', 'Southwest'];

  const toggleAirline = (airline: string) => {
    const updated = selectedAirlines.includes(airline)
      ? selectedAirlines.filter(a => a !== airline)
      : [...selectedAirlines, airline];
    setSelectedAirlines(updated);
    onUpdate({ airlinePreferences: updated });
  };

  const addMustVisit = () => {
    const city = prompt('Enter city name:');
    if (city) {
      const updated = [...mustVisit, city];
      setMustVisit(updated);
      onUpdate({ nonNegotiables: { ...traveler.constraints.nonNegotiables, mustVisit: updated } });
    }
  };

  const removeMustVisit = (city: string) => {
    const updated = mustVisit.filter(c => c !== city);
    setMustVisit(updated);
    onUpdate({ nonNegotiables: { ...traveler.constraints.nonNegotiables, mustVisit: updated } });
  };

  const addCannotTravel = () => {
    const date = prompt('Enter date restriction (e.g., "Jan 12"):');
    if (date) {
      const updated = [...cannotTravel, date];
      setCannotTravel(updated);
      onUpdate({ nonNegotiables: { ...traveler.constraints.nonNegotiables, cannotTravel: updated } });
    }
  };

  const removeCannotTravel = (date: string) => {
    const updated = cannotTravel.filter(d => d !== date);
    setCannotTravel(updated);
    onUpdate({ nonNegotiables: { ...traveler.constraints.nonNegotiables, cannotTravel: updated } });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{traveler.name}'s Constraints</h2>
          <p className="text-slate-600">Configure travel preferences and requirements</p>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="flexibility-toggle">Flexibility Mode</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Strict</span>
            <Switch
              id="flexibility-toggle"
              checked={flexibility === 'flexible'}
              onCheckedChange={(checked) => {
                const newFlex = checked ? 'flexible' : 'strict';
                setFlexibility(newFlex);
                onUpdate({ flexibility: newFlex });
              }}
            />
            <span className="text-sm text-slate-600">Flexible</span>
          </div>
        </div>
      </div>

      {/* Date Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Date Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  onUpdate({ dateAvailability: { ...traveler.constraints.dateAvailability, start: date } });
                }}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  onUpdate({ dateAvailability: { ...traveler.constraints.dateAvailability, end: date } });
                }}
                className="rounded-md border"
                disabled={(date) => startDate ? date < startDate : false}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Cap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Budget Cap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Maximum Budget</Label>
              <span className="text-slate-600">${budgetMax.toLocaleString()}</span>
            </div>
            <Slider
              value={[budgetMax]}
              onValueChange={([value]) => {
                setBudgetMax(value);
                onUpdate({ budget: { ...traveler.constraints.budget, max: value } });
              }}
              min={1000}
              max={10000}
              step={100}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Current Projected Cost</Label>
            <Input
              type="number"
              value={traveler.constraints.budget.current}
              readOnly
              className={
                traveler.constraints.budget.current > budgetMax
                  ? 'border-red-500 bg-red-50'
                  : 'border-green-500 bg-green-50'
              }
            />
            {traveler.constraints.budget.current > budgetMax && (
              <p className="text-red-600 text-sm">
                Over budget by ${(traveler.constraints.budget.current - budgetMax).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Passport/Visa Status */}
      <Card>
        <CardHeader>
          <CardTitle>Passport & Visa Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Passport Status</Label>
            <Select value={passportStatus} onValueChange={(value) => {
              setPassportStatus(value);
              onUpdate({ passportVisa: { ...traveler.constraints.passportVisa, status: value } });
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Valid">Valid</SelectItem>
                <SelectItem value="Pending">Pending Renewal</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Not Applied">Not Applied</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {traveler.constraints.passportVisa.restrictions.length > 0 && (
            <div className="space-y-2">
              <Label>Visa Restrictions</Label>
              <div className="flex flex-wrap gap-2">
                {traveler.constraints.passportVisa.restrictions.map((restriction) => (
                  <Badge key={restriction} variant="destructive">
                    {restriction}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Airline Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Airline Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {airlines.map((airline) => (
              <div key={airline} className="flex items-center space-x-2">
                <Checkbox
                  id={`airline-${airline}`}
                  checked={selectedAirlines.includes(airline)}
                  onCheckedChange={() => toggleAirline(airline)}
                />
                <label htmlFor={`airline-${airline}`} className="cursor-pointer">
                  {airline}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Non-Negotiables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Non-Negotiable Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Must Visit Cities</Label>
              <Button size="sm" variant="outline" onClick={addMustVisit}>
                Add City
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mustVisit.map((city) => (
                <Badge key={city} variant="secondary" className="gap-1">
                  {city}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeMustVisit(city)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Cannot Travel Dates</Label>
              <Button size="sm" variant="outline" onClick={addCannotTravel}>
                Add Date
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cannotTravel.map((date) => (
                <Badge key={date} variant="destructive" className="gap-1">
                  {date}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeCannotTravel(date)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
