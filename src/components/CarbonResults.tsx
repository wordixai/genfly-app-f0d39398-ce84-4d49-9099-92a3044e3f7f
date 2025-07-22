import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Car, Home, ShoppingBag, Globe, TrendingUp, TrendingDown } from 'lucide-react';
import type { CarbonResults } from '@/pages/Index';

interface Props {
  results: CarbonResults | null;
}

const CarbonResultsComponent: React.FC<Props> = ({ results }) => {
  if (!results) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Yet</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Complete the carbon footprint calculator to see your environmental impact analysis and personalized insights.
        </p>
      </div>
    );
  }

  const { transportation, energy, lifestyle, total } = results;
  
  const averageFootprint = 16;
  const comparison = total < averageFootprint ? 'below' : total > averageFootprint ? 'above' : 'equal to';
  const isGoodNews = total < averageFootprint;
  
  const chartData = [
    {
      name: 'Transportation',
      value: transportation,
      percentage: Math.round((transportation / total) * 100),
      icon: Car,
      color: '#3B82F6',
    },
    {
      name: 'Energy',
      value: energy,
      percentage: Math.round((energy / total) * 100),
      icon: Home,
      color: '#F59E0B',
    },
    {
      name: 'Lifestyle',
      value: lifestyle,
      percentage: Math.round((lifestyle / total) * 100),
      icon: ShoppingBag,
      color: '#10B981',
    },
  ];

  const barData = [
    { category: 'Transportation', emissions: transportation },
    { category: 'Energy', emissions: energy },
    { category: 'Lifestyle', emissions: lifestyle },
  ];

  const getSeverityLevel = (total: number) => {
    if (total < 10) return { level: 'Excellent', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50' };
    if (total < 16) return { level: 'Good', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' };
    if (total < 25) return { level: 'Average', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' };
    return { level: 'High', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' };
  };

  const severity = getSeverityLevel(total);

  return (
    <div className="space-y-8">
      {/* Hero Results */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <div className="text-5xl font-bold text-gray-900">{total}</div>
            <div className="text-lg text-gray-600">tons CO₂/year</div>
          </div>
        </div>
        
        <Badge className={`${severity.color} text-white text-base px-4 py-2 mb-4`}>
          {severity.level} Impact Level
        </Badge>
        
        <div className="flex items-center justify-center gap-2 text-lg">
          {isGoodNews ? (
            <TrendingDown className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingUp className="h-5 w-5 text-orange-600" />
          )}
          <span className={isGoodNews ? 'text-green-600' : 'text-orange-600'}>
            {Math.abs(total - averageFootprint).toFixed(1)} tons {comparison} average
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {chartData.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card key={item.name} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-6 w-6" style={{ color: item.color }} />
                  <Badge variant="secondary" className="text-xs">
                    {item.percentage}%
                  </Badge>
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2" style={{ color: item.color }}>
                  {item.value} tons
                </div>
                <Progress value={item.percentage} className="h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Category</CardTitle>
            <CardDescription>Your annual CO₂ emissions breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} tons`, 'CO₂ Emissions']}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="emissions" 
                  fill="url(#gradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution Overview</CardTitle>
            <CardDescription>Percentage contribution by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}\n${percentage}%`}
                  labelLine={false}
                  fontSize={12}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} tons`, 'CO₂ Emissions']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Impact Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="text-center py-8">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(total * 2204).toLocaleString()}
            </div>
            <div className="text-blue-600 font-medium">pounds of CO₂</div>
            <div className="text-sm text-gray-600 mt-2">Annual equivalent</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="text-center py-8">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round(total / 0.039).toLocaleString()}
            </div>
            <div className="text-green-600 font-medium">trees needed</div>
            <div className="text-sm text-gray-600 mt-2">To offset annually</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="text-center py-8">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.round(total / 0.411).toLocaleString()}
            </div>
            <div className="text-orange-600 font-medium">gallons of gas</div>
            <div className="text-sm text-gray-600 mt-2">Equivalent impact</div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison with Targets */}
      <Card className={severity.bgColor}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Global Climate Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Your footprint</span>
              <span className="font-bold text-lg">{total} tons</span>
            </div>
            <Progress value={(total / 30) * 100} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Global target (2030):</span>
                <span className="font-semibold">2.3 tons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">US average:</span>
                <span className="font-semibold">{averageFootprint} tons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Global average:</span>
                <span className="font-semibold">4.8 tons</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonResultsComponent;