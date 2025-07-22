import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, BarChart3, Lightbulb } from 'lucide-react';
import CarbonCalculator from '@/components/CarbonCalculator';
import CarbonResults from '@/components/CarbonResults';
import CarbonRecommendations from '@/components/CarbonRecommendations';

export interface CarbonData {
  transportation: {
    carMiles: number;
    carEfficiency: number;
    publicTransport: number;
    flights: number;
  };
  energy: {
    electricity: number;
    gas: number;
    heating: number;
  };
  lifestyle: {
    diet: string;
    shopping: number;
    waste: number;
  };
}

export interface CarbonResults {
  transportation: number;
  energy: number;
  lifestyle: number;
  total: number;
}

const Index = () => {
  const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
  const [results, setResults] = useState<CarbonResults | null>(null);

  const handleCalculation = (data: CarbonData, calculatedResults: CarbonResults) => {
    setCarbonData(data);
    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Carbon Footprint Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Measure your environmental impact and discover ways to reduce it
          </p>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculate
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint Assessment</CardTitle>
                <CardDescription>
                  Enter your annual consumption data to calculate your carbon footprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CarbonCalculator onCalculate={handleCalculation} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Your Carbon Footprint Results</CardTitle>
                <CardDescription>
                  Breakdown of your annual CO₂ emissions by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CarbonResults results={results} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Reduction Strategies</CardTitle>
                <CardDescription>
                  Personalized recommendations to reduce your carbon footprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CarbonRecommendations carbonData={carbonData} results={results} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;