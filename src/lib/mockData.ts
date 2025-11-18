export interface Traveler {
  id: string;
  name: string;
  avatar: string;
  constraints: TravelerConstraints;
}

export interface TravelerConstraints {
  dateAvailability: {
    start: Date | null;
    end: Date | null;
    blackoutDates: Date[];
  };
  budget: {
    max: number;
    current: number;
  };
  passportVisa: {
    status: string;
    restrictions: string[];
  };
  airlinePreferences: string[];
  nonNegotiables: {
    mustVisit: string[];
    cannotTravel: string[];
  };
  flexibility: 'strict' | 'flexible';
}

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  avgCost: number;
}

export interface Route {
  id: string;
  cities: string[];
  status: 'feasible' | 'partial' | 'infeasible';
  totalCost: number;
  travelTime: number;
  conflicts: string[];
}

export const mockTravelers: Traveler[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    constraints: {
      dateAvailability: {
        start: new Date('2025-01-15'),
        end: new Date('2025-02-15'),
        blackoutDates: [new Date('2025-01-12')]
      },
      budget: {
        max: 5000,
        current: 4200
      },
      passportVisa: {
        status: 'Valid',
        restrictions: []
      },
      airlinePreferences: ['Delta', 'United'],
      nonNegotiables: {
        mustVisit: ['Tokyo'],
        cannotTravel: ['Jan 12']
      },
      flexibility: 'flexible'
    }
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: 'JS',
    constraints: {
      dateAvailability: {
        start: new Date('2025-01-20'),
        end: new Date('2025-02-20'),
        blackoutDates: []
      },
      budget: {
        max: 3500,
        current: 3750
      },
      passportVisa: {
        status: 'Valid',
        restrictions: []
      },
      airlinePreferences: ['American', 'Delta'],
      nonNegotiables: {
        mustVisit: ['Kyoto'],
        cannotTravel: []
      },
      flexibility: 'strict'
    }
  },
  {
    id: '3',
    name: 'Priya Patel',
    avatar: 'PP',
    constraints: {
      dateAvailability: {
        start: new Date('2025-01-10'),
        end: new Date('2025-02-03'),
        blackoutDates: [new Date('2025-02-03')]
      },
      budget: {
        max: 4500,
        current: 3900
      },
      passportVisa: {
        status: 'Pending',
        restrictions: ['China']
      },
      airlinePreferences: ['United', 'ANA'],
      nonNegotiables: {
        mustVisit: ['Osaka'],
        cannotTravel: ['Feb 3']
      },
      flexibility: 'flexible'
    }
  },
  {
    id: '4',
    name: 'David Chen',
    avatar: 'DC',
    constraints: {
      dateAvailability: {
        start: new Date('2025-01-25'),
        end: new Date('2025-02-10'),
        blackoutDates: []
      },
      budget: {
        max: 6000,
        current: 4500
      },
      passportVisa: {
        status: 'Valid',
        restrictions: []
      },
      airlinePreferences: ['ANA', 'JAL'],
      nonNegotiables: {
        mustVisit: ['Tokyo', 'Kyoto'],
        cannotTravel: []
      },
      flexibility: 'strict'
    }
  }
];

export const mockCities: City[] = [
  { id: '1', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, avgCost: 1500 },
  { id: '2', name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681, avgCost: 1200 },
  { id: '3', name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023, avgCost: 1100 },
  { id: '4', name: 'Hiroshima', country: 'Japan', lat: 34.3853, lng: 132.4553, avgCost: 900 },
  { id: '5', name: 'Nara', country: 'Japan', lat: 34.6851, lng: 135.8048, avgCost: 800 }
];

export const mockRoutes: Route[] = [
  {
    id: '1',
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    status: 'feasible',
    totalCost: 3800,
    travelTime: 8,
    conflicts: []
  },
  {
    id: '2',
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima'],
    status: 'partial',
    totalCost: 4700,
    travelTime: 12,
    conflicts: ['Priya cannot travel Feb 3', 'Exceeds John\'s budget by $250']
  },
  {
    id: '3',
    cities: ['Kyoto', 'Nara', 'Osaka', 'Tokyo'],
    status: 'feasible',
    totalCost: 4100,
    travelTime: 9,
    conflicts: []
  },
  {
    id: '4',
    cities: ['Tokyo', 'Hiroshima', 'Kyoto'],
    status: 'infeasible',
    totalCost: 5200,
    travelTime: 15,
    conflicts: ['Travel dates exceed David\'s PTO window', 'Exceeds John\'s budget by $1,200']
  }
];
