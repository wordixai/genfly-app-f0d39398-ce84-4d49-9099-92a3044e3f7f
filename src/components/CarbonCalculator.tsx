import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Home, ShoppingBag } from 'lucide-react';
import type { CarbonData, CarbonResults } from '@/pages/Index';

interface Props {
  onCalculate: (data: CarbonData, results: CarbonResults) => void;
}

const CarbonCalculator: React.FC<Props> = ({ onCalculate }) => {
  const [formData, setFormData] = useState<CarbonData>({
    transportation: {
      carMiles: 0,
      carEfficiency: 25,
      publicTransport: 0,
      flights: 0,
    },
    energy: {
      electricity: 0,
      gas: 0,
      heating: 0,
    },
    lifestyle: {
      diet: 'mixed',
      shopping: 0,
      waste: 0,
    },
  });

  const calculateFootprint = (): CarbonResults => {
    const { transportation, energy, lifestyle } = formData;

    // Transportation calculations (tons CO2/year)
    const carEmissions = (transportation.carMiles / transportation.carEfficiency) * 19.6 / 2000; // 19.6 lbs CO2 per gallon
    const publicTransportEmissions = transportation.publicTransport * 0.0004; // 0.4 kg CO2 per mile
    const flightEmissions = transportation.flights * 0.5; // 0.5 tons CO2 per flight
    const totalTransportation = carEmissions + publicTransportEmissions + flightEmissions;

    // Energy calculations (tons CO2/year)
    const electricityEmissions = energy.electricity * 12 * 0.0004; // 0.4 kg CO2 per kWh
    const gasEmissions = energy.gas * 12 * 0.005; // 5 kg CO2 per therm
    const heatingEmissions = energy.heating * 0.002; // 2 kg CO2 per dollar spent
    const totalEnergy = electricityEmissions + gasEmissions + heatingEmissions;

    // Lifestyle calculations (tons CO2/year)
    const dietMultipliers = {
      vegan: 1.5,
      vegetarian: 2.5,
      mixed: 3.3,
      meat_heavy: 4.5,
    };
    const dietEmissions = dietMultipliers[lifestyle.diet as keyof typeof dietMultipliers] || 3.3;
    const shoppingEmissions = lifestyle.shopping * 0.01; // 0.01 tons CO2 per $1000 spent
    const wasteEmissions = lifestyle.waste * 0.002; // 2 kg CO2 per bag
    const totalLifestyle = dietEmissions + shoppingEmissions + wasteEmissions;

    const total = totalTransportation + totalEnergy + totalLifestyle;

    return {
      transportation: Number(totalTransportation.toFixed(2)),
      energy: Number(totalEnergy.toFixed(2)),
      lifestyle: Number(totalLifestyle.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const results = calculateFootprint();
    onCalculate(formData, results);
  };

  const updateField = (category: keyof CarbonData, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transportation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Transportation
          </CardTitle>
          <CardDescription>
            Your annual transportation habits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carMiles">Annual car miles driven</Label>
              <Input
                id="carMiles"
                type="number"
                placeholder="12000"
                value={formData.transportation.carMiles || ''}
                onChange={e => updateField('transportation', 'carMiles', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carEfficiency">Car fuel efficiency (MPG)</Label>
              <Input
                id="carEfficiency"
                type="number"
                placeholder="25"
                value={formData.transportation.carEfficiency || ''}
                onChange={e => updateField('transportation', 'carEfficiency', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicTransport">Annual public transport miles</Label>
              <Input
                id="publicTransport"
                type="number"
                placeholder="2000"
                value={formData.transportation.publicTransport || ''}
                onChange={e => updateField('transportation', 'publicTransport', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flights">Number of flights per year</Label>
              <Input
                id="flights"
                type="number"
                placeholder="2"
                value={formData.transportation.flights || ''}
                onChange={e => updateField('transportation', 'flights', Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Home Energy
          </CardTitle>
          <CardDescription>
            Your monthly energy consumption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="electricity">Monthly electricity (kWh)</Label>
              <Input
                id="electricity"
                type="number"
                placeholder="900"
                value={formData.energy.electricity || ''}
                onChange={e => updateField('energy', 'electricity', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gas">Monthly natural gas (therms)</Label>
              <Input
                id="gas"
                type="number"
                placeholder="50"
                value={formData.energy.gas || ''}
                onChange={e => updateField('energy', 'gas', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heating">Annual heating costs ($)</Label>
              <Input
                id="heating"
                type="number"
                placeholder="1200"
                value={formData.energy.heating || ''}
                onChange={e => updateField('energy', 'heating', Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Lifestyle
          </CardTitle>
          <CardDescription>
            Your consumption and waste habits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diet">Diet type</Label>
              <Select
                value={formData.lifestyle.diet}
                onValueChange={value => updateField('lifestyle', 'diet', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="mixed">Mixed diet</SelectItem>
                  <SelectItem value="meat_heavy">Heavy meat diet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopping">Annual shopping ($1000s)</Label>
              <Input
                id="shopping"
                type="number"
                placeholder="5"
                value={formData.lifestyle.shopping || ''}
                onChange={e => updateField('lifestyle', 'shopping', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waste">Weekly waste bags</Label>
              <Input
                id="waste"
                type="number"
                placeholder="3"
                value={formData.lifestyle.waste || ''}
                onChange={e => updateField('lifestyle', 'waste', Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
        Calculate My Carbon Footprint
      </Button>
    </form>
  );
};

export default CarbonCalculator;