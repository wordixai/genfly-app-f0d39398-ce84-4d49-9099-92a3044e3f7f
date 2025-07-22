import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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
  Utensils,
  Target,
  Star,
  ArrowRight
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
  savings: number;
  icon: React.ElementType;
  difficulty: 'easy' | 'medium' | 'hard';
  cost: 'free' | 'low' | 'medium' | 'high';
  actionSteps: string[];
}

const CarbonRecommendations: React.FC<Props> = ({ carbonData, results }) => {
  if (!carbonData || !results) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready for Recommendations?</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Complete the carbon calculation to receive personalized strategies for reducing your environmental impact.
        </p>
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
        description: 'Combine trips, work remotely, and use alternative transportation for short distances.',
        category: 'transportation',
        impact: 'high',
        savings: results.transportation * 0.2,
        icon: Car,
        difficulty: 'medium',
        cost: 'free',
        actionSteps: [
          'Work from home 2 days per week',
          'Combine errands into single trips',
          'Walk or bike for trips under 2 miles',
          'Use public transit for longer commutes'
        ]
      });
    }

    if (carbonData.transportation.carEfficiency < 30) {
      recommendations.push({
        id: 'upgrade-car',
        title: 'Upgrade to efficient vehicle',
        description: 'Consider hybrid, electric, or high-efficiency vehicle for your next purchase.',
        category: 'transportation',
        impact: 'high',
        savings: results.transportation * 0.5,
        icon: Zap,
        difficulty: 'hard',
        cost: 'high',
        actionSteps: [
          'Research electric vehicle incentives',
          'Compare hybrid vs. electric options',
          'Test drive efficient vehicles',
          'Consider used efficient vehicles'
        ]
      });
    }

    if (carbonData.transportation.flights > 2) {
      recommendations.push({
        id: 'reduce-flights',
        title: 'Optimize air travel',
        description: 'Choose closer destinations, extend trip durations, and consider alternatives.',
        category: 'transportation',
        impact: 'high',
        savings: carbonData.transportation.flights * 0.25,
        icon: Plane,
        difficulty: 'medium',
        cost: 'free',
        actionSteps: [
          'Plan longer vacations vs. frequent trips',
          'Explore local and regional destinations',
          'Choose direct flights when possible',
          'Consider train travel for medium distances'
        ]
      });
    }

    // Energy recommendations
    if (carbonData.energy.electricity > 800) {
      recommendations.push({
        id: 'reduce-electricity',
        title: 'Cut electricity usage',
        description: 'Simple changes to reduce your home energy consumption significantly.',
        category: 'energy',
        impact: 'medium',
        savings: results.energy * 0.15,
        icon: Lightbulb,
        difficulty: 'easy',
        cost: 'low',
        actionSteps: [
          'Switch to LED light bulbs',
          'Unplug devices when not in use',
          'Use programmable thermostat',
          'Air dry clothes instead of using dryer'
        ]
      });
    }

    recommendations.push({
      id: 'solar-panels',
      title: 'Install solar panels',
      description: 'Generate clean energy and significantly reduce grid electricity dependence.',
      category: 'energy',
      impact: 'high',
      savings: results.energy * 0.7,
      icon: Home,
      difficulty: 'hard',
      cost: 'high',
      actionSteps: [
        'Get solar assessment for your roof',
        'Research federal and state incentives',
        'Compare solar installation companies',
        'Consider solar leasing options'
      ]
    });

    // Lifestyle recommendations
    if (carbonData.lifestyle.diet === 'meat_heavy') {
      recommendations.push({
        id: 'reduce-meat',
        title: 'Adopt flexitarian diet',
        description: 'Reduce meat consumption with meatless meals several times per week.',
        category: 'lifestyle',
        impact: 'medium',
        savings: 1.2,
        icon: Utensils,
        difficulty: 'easy',
        cost: 'free',
        actionSteps: [
          'Start with "Meatless Monday"',
          'Try plant-based protein sources',
          'Explore vegetarian recipes',
          'Choose smaller meat portions'
        ]
      });
    }

    recommendations.push({
      id: 'conscious-shopping',
      title: 'Shop sustainably',
      description: 'Make environmentally conscious purchasing decisions and reduce consumption.',
      category: 'lifestyle',
      impact: 'medium',
      savings: results.lifestyle * 0.3,
      icon: ShoppingBag,
      difficulty: 'medium',
      cost: 'free',
      actionSteps: [
        'Buy local and seasonal products',
        'Choose quality items that last longer',
        'Buy second-hand when possible',
        'Reduce impulse purchases'
      ]
    });

    recommendations.push({
      id: 'carbon-offset',
      title: 'Purchase carbon offsets',
      description: 'Support verified projects that remove or prevent CO₂ emissions.',
      category: 'lifestyle',
      impact: 'medium',
      savings: results.total * 0.1,
      icon: TreePine,
      difficulty: 'easy',
      cost: 'low',
      actionSteps: [
        'Choose Gold Standard certified offsets',
        'Support reforestation projects',
        'Invest in renewable energy projects',
        'Track your offset progress'
      ]
    });

    return recommendations.sort((a, b) => b.savings - a.savings);
  };

  const recommendations = generateRecommendations();
  const totalPotentialSavings = recommendations.reduce((sum, rec) => sum + rec.savings, 0);
  const quickWins = recommendations.filter(rec => rec.difficulty === 'easy').slice(0, 3);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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
    <div className="space-y-8">
      {/* Potential Impact Summary */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
            Your Reduction Potential
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {totalPotentialSavings.toFixed(1)}
              </div>
              <div className="text-emerald-700 font-medium">tons CO₂ savings</div>
              <div className="text-sm text-gray-600">Potential annual reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Math.round((totalPotentialSavings / results.total) * 100)}%
              </div>
              <div className="text-blue-700 font-medium">footprint reduction</div>
              <div className="text-sm text-gray-600">Of your current emissions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {recommendations.length}
              </div>
              <div className="text-purple-700 font-medium">action items</div>
              <div className="text-sm text-gray-600">Personalized for you</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Wins Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Star className="h-6 w-6 text-yellow-500" />
            Quick Wins - Start Here!
          </CardTitle>
          <CardDescription>
            Easy actions you can implement immediately for fast impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickWins.map(rec => {
              const IconComponent = rec.icon;
              return (
                <div key={rec.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="h-5 w-5 text-green-600" />
                    <div className="font-semibold text-gray-900">{rec.title}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{rec.description}</div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-500 text-white text-xs">
                      Save {rec.savings.toFixed(1)} tons
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Recommendations */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">All Recommendations</h3>
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((rec, index) => {
            const IconComponent = rec.icon;
            const reductionPercentage = (rec.savings / results.total) * 100;

            return (
              <Card key={rec.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{rec.title}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {rec.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">
                        -{rec.savings.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">tons CO₂/year</div>
                      <div className="text-xs text-gray-400">
                        ({reductionPercentage.toFixed(1)}% reduction)
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={reductionPercentage} className="h-2" />
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`text-white ${getImpactColor(rec.impact)}`}>
                        {rec.impact} impact
                      </Badge>
                      <Badge className={getDifficultyColor(rec.difficulty)}>
                        {rec.difficulty}
                      </Badge>
                      <Badge className={getCostColor(rec.cost)}>
                        {rec.cost === 'free' ? 'Free' : `${rec.cost} cost`}
                      </Badge>
                      <Badge variant="outline">
                        {rec.category}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Action Steps:</h4>
                      <ul className="space-y-1">
                        {rec.actionSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Take Action?</h3>
          <p className="text-lg mb-6 opacity-90">
            Start with the quick wins above and gradually implement more changes. Every action counts!
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-2">
            Track My Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonRecommendations;