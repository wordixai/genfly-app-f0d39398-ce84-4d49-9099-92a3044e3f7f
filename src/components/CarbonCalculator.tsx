import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Home, ShoppingBag, ArrowRight } from 'lucide-react';
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
    const carEmissions = (transportation.carMiles / transportation.carEfficiency) * 19.6 / 2000;
    const publicTransportEmissions = transportation.publicTransport * 0.0004;
    const flightEmissions = transportation.flights * 0.5;
    const totalTransportation = carEmissions + publicTransportEmissions + flightEmissions;

    // Energy calculations (tons CO2/year)
    const electricityEmissions = energy.electricity * 12 * 0.0004;
    const gasEmissions = energy.gas * 12 * 0.005;
    const heatingEmissions = energy.heating * 0.002;
    const totalEnergy = electricityEmissions + gasEmissions + heatingEmissions;

    // Lifestyle calculations (tons CO2/year)
    const dietMultipliers = {
      vegan: 1.5,
      vegetarian: 2.5,
      mixed: 3.3,
      meat_heavy: 4.5,
    };
    const dietEmissions = dietMultipliers[lifestyle.diet as keyof typeof dietMultipliers] || 3.3;
    const shoppingEmissions = lifestyle.shopping * 0.01;
    const wasteEmissions = lifestyle.waste * 0.002;
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Transportation Section */}
      <Card className="border border-blue-100 hover:border-blue-200 transition-colors duration-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            Transportation
          </CardTitle>
          <CardDescription className="text-base">
            How do you get around? Include all forms of transportation you use annually.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="carMiles" className="text-sm font-medium text-gray-700">
                Annual car miles driven
              </Label>
              <Input
                id="carMiles"
                type="number"
                placeholder="12,000"
                className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.transportation.carMiles || ''}
                onChange={e => updateField('transportation', 'carMiles', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Average US driver: 12,000 miles/year</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="carEfficiency" className="text-sm font-medium text-gray-700">
                Car fuel efficiency (MPG)
              </Label>
              <Input
                id="carEfficiency"
                type="number"
                placeholder="25"
                className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.transportation.carEfficiency || ''}
                onChange={e => updateField('transportation', 'carEfficiency', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Check your car's EPA rating</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="publicTransport" className="text-sm font-medium text-gray-700">
                Annual public transport miles
              </Label>
              <Input
                id="publicTransport"
                type="number"
                placeholder="2,000"
                className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.transportation.publicTransport || ''}
                onChange={e => updateField('transportation', 'publicTransport', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Bus, train, subway commuting</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="flights" className="text-sm font-medium text-gray-700">
                Number of flights per year
              </Label>
              <Input
                id="flights"
                type="number"
                placeholder="2"
                className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.transportation.flights || ''}
                onChange={e => updateField('transportation', 'flights', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Round trips count as 2 flights</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Section */}
      <Card className="border border-orange-100 hover:border-orange-200 transition-colors duration-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Home className="h-6 w-6 text-orange-600" />
            </div>
            Home Energy
          </CardTitle>
          <CardDescription className="text-base">
            Your home's energy consumption including electricity, gas, and heating.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label htmlFor="electricity" className="text-sm font-medium text-gray-700">
                Monthly electricity (kWh)
              </Label>
              <Input
                id="electricity"
                type="number"
                placeholder="900"
                className="h-11 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                value={formData.energy.electricity || ''}
                onChange={e => updateField('energy', 'electricity', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Check your electricity bill</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="gas" className="text-sm font-medium text-gray-700">
                Monthly natural gas (therms)
              </Label>
              <Input
                id="gas"
                type="number"
                placeholder="50"
                className="h-11 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                value={formData.energy.gas || ''}
                onChange={e => updateField('energy', 'gas', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Natural gas usage from bill</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="heating" className="text-sm font-medium text-gray-700">
                Annual heating costs ($)
              </Label>
              <Input
                id="heating"
                type="number"
                placeholder="1,200"
                className="h-11 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                value={formData.energy.heating || ''}
                onChange={e => updateField('energy', 'heating', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Oil, propane, or other heating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Section */}
      <Card className="border border-green-100 hover:border-green-200 transition-colors duration-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            Lifestyle & Consumption
          </CardTitle>
          <CardDescription className="text-base">
            Your diet, shopping habits, and waste generation patterns.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label htmlFor="diet" className="text-sm font-medium text-gray-700">
                Primary diet type
              </Label>
              <Select
                value={formData.lifestyle.diet}
                onValueChange={value => updateField('lifestyle', 'diet', value)}
              >
                <SelectTrigger className="h-11 border-gray-200 focus:border-green-400 focus:ring-green-400">
                  <SelectValue placeholder="Select your diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegan">Vegan (1.5 tons CO₂/year)</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian (2.5 tons CO₂/year)</SelectItem>
                  <SelectItem value="mixed">Mixed diet (3.3 tons CO₂/year)</SelectItem>
                  <SelectItem value="meat_heavy">Heavy meat (4.5 tons CO₂/year)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Diet has major climate impact</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="shopping" className="text-sm font-medium text-gray-700">
                Annual shopping ($1000s)
              </Label>
              <Input
                id="shopping"
                type="number"
                placeholder="5"
                className="h-11 border-gray-200 focus:border-green-400 focus:ring-green-400"
                value={formData.lifestyle.shopping || ''}
                onChange={e => updateField('lifestyle', 'shopping', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Clothes, electronics, goods</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="waste" className="text-sm font-medium text-gray-700">
                Weekly waste bags
              </Label>
              <Input
                id="waste"
                type="number"
                placeholder="3"
                className="h-11 border-gray-200 focus:border-green-400 focus:ring-green-400"
                value={formData.lifestyle.waste || ''}
                onChange={e => updateField('lifestyle', 'waste', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Typical garbage bags per week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 h-12 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
        >
          Calculate My Carbon Footprint
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default CarbonCalculator;