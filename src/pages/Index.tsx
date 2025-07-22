import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, BarChart3, Lightbulb, Leaf } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('calculator');

  const handleCalculation = (data: CarbonData, calculatedResults: CarbonResults) => {
    setCarbonData(data);
    setResults(calculatedResults);
    // Auto-switch to results tab
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-25 to-sky-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Leaf className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Carbon Footprint Calculator
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto opacity-90">
            Measure your environmental impact and discover actionable ways to reduce it
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <span>Science-based calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <span>Track your progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white shadow-lg border-0 h-12">
            <TabsTrigger 
              value="calculator" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-200"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculate</span>
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-200"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Actions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-0">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    Calculate Your Carbon Footprint
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Enter your annual consumption data to get an accurate assessment of your environmental impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarbonCalculator onCalculate={handleCalculation} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            <div className="max-w-6xl mx-auto">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    Your Environmental Impact
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Understanding your carbon footprint across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarbonResults results={results} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-0">
            <div className="max-w-5xl mx-auto">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    Your Action Plan
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Personalized strategies to reduce your environmental impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarbonRecommendations carbonData={carbonData} results={results} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;