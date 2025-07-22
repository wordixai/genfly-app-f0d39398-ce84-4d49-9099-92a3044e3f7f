import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Car, 
  Home, 
  ShoppingBag, 
  Lightbulb, 
  Leaf, 
  Zap, 
  Recycle, 
  TreePine,
  Plane,
  Utensils
} from 'lucide-react';
import type { CarbonData, CarbonResults } from '@/pages/Index';

interface Props {
  carbonData: CarbonData | null;
  results: CarbonResults | null;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'transportation' | 'energy' | 'lifestyle';
  impact: 'high' | 'medium' | 'low';
  savings: number; // tons CO2 per year
  icon: React.ElementType;
  difficulty: 'easy' | 'medium' | 'hard';
  cost: 'free' | 'low' | 'medium' | 'high';
}

const CarbonRecommendations: React.FC<Props> = ({ carbonData, results }) => {
  if (!carbonData || !results) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Complete the carbon footprint calculation to see personalized recommendations.</p>
      </div>
    );
  }

  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Transportation recommendations
    if (carbonData.transportation.carMiles > 10000) {
      recommendations.push({
        id: 'reduce-driving',
        title: 'Reduce driving by 20%',
        description: 'Work from home, combine trips, or use alternative transportation for short distances.',
        category: 'transportation',
        impact: 'high',
        savings: results.transportation * 0.2,
        icon: Car,
        difficulty: 'medium',
        cost: 'free',
      });
    }

    if (carbonData.transportation.carEfficiency < 30) {
      recommendations.push({
        id: 'upgrade-car',
        title: 'Upgrade to a fuel-efficient vehicle',
        description: 'Consider a hybrid or electric vehicle for your next car purchase.',
        category: 'transportation',
        impact: 'high',
        savings: results.transportation * 0.5,
        icon: Zap,
        difficulty: 'hard',
        cost: 'high',
      });
    }

    if (carbonData.transportation.flights > 2) {
      recommendations.push({
        id: 'reduce-flights',
        title: 'Reduce air travel',
        description: 'Choose destinations closer to home or extend trips to reduce frequency.',
        category: 'transportation',
        impact: 'high',
        savings: carbonData.transportation.flights * 0.25,
        icon: Plane,
        difficulty: 'medium',
        cost: 'free',
      });
    }

    // Energy recommendations
    if (carbonData.energy.electricity > 800) {
      recommendations.push({
        id: 'reduce-electricity',
        title: 'Reduce electricity consumption',
        description: 'Use LED bulbs, unplug devices, and adjust thermostat settings.',
        category: 'energy',
        impact: 'medium',
        savings: results.energy * 0.15,
        icon: Lightbulb,
        difficulty: 'easy',
        cost: 'low',
      });
    }

    recommendations.push({
      id: 'solar-panels',
      title: 'Install solar panels',
      description: 'Generate clean energy and reduce dependence on grid electricity.',
      category: 'energy',
      impact: 'high',
      savings: results.energy * 0.7,
      icon: Home,
      difficulty: 'hard',
      cost: 'high',
    });

    if (carbonData.energy.heating > 1000) {
      recommendations.push({
        id: 'insulation',
        title: 'Improve home insulation',
        description: 'Better insulation reduces heating and cooling energy needs.',
        category: 'energy',
        impact: 'medium',
        savings: results.energy * 0.25,
        icon: Home,
        difficulty: 'medium',
        cost: 'medium',
      });
    }

    // Lifestyle recommendations
    if (carbonData.lifestyle.diet === 'meat_heavy') {
      recommendations.push({
        id: 'reduce-meat',
        title: 'Reduce meat consumption',
        description: 'Try meatless meals 2-3 times per week to lower your dietary footprint.',
        category: 'lifestyle',
        impact: 'medium',
        savings: 1.2,
        icon: Utensils,
        difficulty: 'easy',
        cost: 'free',
      });
    }

    recommendations.push({
      id: 'reduce-waste',
      title: 'Minimize waste generation',
      description: 'Buy less, reuse items, and recycle properly to reduce waste impact.',
      category: 'lifestyle',
      impact: 'low',
      savings: 0.5,
      icon: Recycle,
      difficulty: 'easy',
      cost: 'free',
    });

    if (carbonData.lifestyle.shopping > 8) {
      recommendations.push({
        id: 'conscious-shopping',
        title: 'Shop more consciously',
        description: 'Buy local, choose sustainable brands, and reduce impulse purchases.',
        category: 'lifestyle',
        impact: 'medium',
        savings: results.lifestyle * 0.3,
        icon: ShoppingBag,
        difficulty: 'medium',
        cost: 'free',
      });
    }

    // Universal recommendations
    recommendations.push({
      id: 'carbon-offset',
      title: 'Purchase carbon offsets',
      description: 'Support verified carbon offset projects for emissions you cannot reduce.',
      category: 'lifestyle',
      impact: 'medium',
      savings: results.total * 0.1,
      icon: TreePine,
      difficulty: 'easy',
      cost: 'low',
    });

    return recommendations.sort((a, b) => b.savings - a.savings);
  };

  const recommendations = generateRecommendations();
  const totalPotentialSavings = recommendations.reduce((sum, rec) => sum + rec.savings, 0);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            Reduction Potential
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {totalPotentialSavings.toFixed(1)} tons
              </div>
              <div className="text-sm text-gray-600">Potential CO₂ savings per year</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((totalPotentialSavings / results.total) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Footprint reduction possible</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {recommendations.length}
              </div>
              <div className="text-sm text-gray-600">Personalized recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon;
          const reductionPercentage = (rec.savings / results.total) * 100;

          return (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {rec.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      -{rec.savings.toFixed(1)} tons
                    </div>
                    <div className="text-sm text-gray-500">
                      ({reductionPercentage.toFixed(1)}% reduction)
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={reductionPercentage} className="h-2" />
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getImpactColor(rec.impact)}>
                      Impact: {rec.impact}
                    </Badge>
                    <Badge className={getDifficultyColor(rec.difficulty)}>
                      Difficulty: {rec.difficulty}
                    </Badge>
                    <Badge className={getCostColor(rec.cost)}>
                      Cost: {rec.cost}
                    </Badge>
                    <Badge variant="outline">
                      {rec.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Wins */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Wins - Start Here!</CardTitle>
          <CardDescription>
            Easy actions you can take today to reduce your carbon footprint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations
              .filter(rec => rec.difficulty === 'easy')
              .slice(0, 4)
              .map(rec => {
                const IconComponent = rec.icon;
                return (
                  <div key={rec.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IconComponent className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">{rec.title}</div>
                      <div className="text-sm text-gray-600">
                        Save {rec.savings.toFixed(1)} tons CO₂/year
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonRecommendations;