import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Car, Home, ShoppingBag, Globe } from 'lucide-react';
import type { CarbonResults } from '@/pages/Index';

interface Props {
  results: CarbonResults | null;
}

const CarbonResultsComponent: React.FC<Props> = ({ results }) => {
  if (!results) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No results available. Please complete the carbon footprint calculator first.</p>
      </div>
    );
  }

  const { transportation, energy, lifestyle, total } = results;
  
  // Average carbon footprint is about 16 tons CO2 per year
  const averageFootprint = 16;
  const comparison = total < averageFootprint ? 'below' : total > averageFootprint ? 'above' : 'equal to';
  
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
      color: '#EF4444',
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
    if (total < 10) return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-700' };
    if (total < 16) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    if (total < 25) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-700' };
    return { level: 'Very High', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const severity = getSeverityLevel(total);

  return (
    <div className="space-y-6">
      {/* Overall Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Globe className="h-6 w-6" />
              Total Annual Footprint
            </CardTitle>
            <div className="text-4xl font-bold text-blue-600">{total} tons</div>
            <CardDescription>CO₂ equivalent per year</CardDescription>
            <Badge className={`${severity.color} text-white`}>
              {severity.level} Impact
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>vs. National Average ({averageFootprint} tons)</span>
                <span className={comparison === 'below' ? 'text-green-600' : 'text-orange-600'}>
                  {Math.abs(total - averageFootprint).toFixed(1)} tons {comparison}
                </span>
              </div>
              <Progress value={(total / 30) * 100} className="h-3" />
              <p className="text-xs text-gray-500 text-center">
                Global target: 2.3 tons per person by 2030
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" style={{ color: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{item.value} tons</div>
                      <div className="text-xs text-gray-500">{item.percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Category</CardTitle>
            <CardDescription>Annual CO₂ emissions breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value} tons`, 'CO₂ Emissions']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Bar dataKey="emissions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution Overview</CardTitle>
            <CardDescription>Percentage contribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  labelLine={false}
                  fontSize={12}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} tons`, 'CO₂ Emissions']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Impact Context */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Your Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{Math.round(total * 2204)} lbs</div>
              <div className="text-sm text-gray-600">CO₂ equivalent</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.round(total / 0.039)}</div>
              <div className="text-sm text-gray-600">Trees needed to offset annually</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{Math.round(total / 0.411)}</div>
              <div className="text-sm text-gray-600">Gallons of gasoline equivalent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonResultsComponent;