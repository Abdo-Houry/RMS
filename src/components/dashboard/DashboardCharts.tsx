import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Data types
interface Article {
    id: string;
    title: string;
    imagePath: string;
    articleCategoryName: string;
    articleCategoryId: string;
}

interface Meal {
    id: string;
    name: string;
    imagePath: string;
    mealCategoryId: string;
    mealCategoryName: string;
}

interface MealCategory {
    id: string;
    name: string;
    mealsCount: number;
}

interface DashboardData {
    articlesData?: {
        data: {
            values: Article[];
            pages: number;
        };
    };
    mealsData?: {
        data: {
            values: Meal[];
            pages: number;
        };
    };
    categoriesData?: {
        data: {
            values: MealCategory[];
            pages: number;
        };
    };
}

export function DashboardCharts({ articlesData, mealsData, categoriesData }: DashboardData) {
    // Prepare data
    const totalArticles = articlesData?.data.values.length || 0;
    const totalMeals = mealsData?.data.values.length || 0;
    const totalCategories = categoriesData?.data.values.length || 0;

    // Meal distribution by category
    const mealDistribution = categoriesData?.data.values.map(category => ({
        name: category.name,
        count: category.mealsCount,
        percentage: totalMeals > 0 ? (category.mealsCount / totalMeals) * 100 : 0
    })) || [];

    // Article distribution by category
    const articleCategories = articlesData?.data.values.reduce((acc, article) => {
        const categoryName = article.articleCategoryName;
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const articleDistribution = Object.entries(articleCategories || {}).map(([name, count]) => ({
        name,
        count,
        percentage: totalArticles > 0 ? (count / totalArticles) * 100 : 0
    }));

    // Recent items
    const recentArticles = articlesData?.data.values.slice(0, 5) || [];
    const recentMeals = mealsData?.data.values.slice(0, 5) || [];

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-card to-chart-1/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <div className="h-4 w-4 text-chart-1">📝</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-chart-1">{totalArticles}</div>
                        <p className="text-xs text-muted-foreground">
                            articles in the system
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-chart-5/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
                        <div className="h-4 w-4 text-chart-5">🍽️</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-chart-5">{totalMeals}</div>
                        <p className="text-xs text-muted-foreground">
                            meals in the menu
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-chart-2/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Meal Categories</CardTitle>
                        <div className="h-4 w-4 text-chart-2">📂</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-chart-2">{totalCategories}</div>
                        <p className="text-xs text-muted-foreground">
                            different categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Distribution */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Meal Distribution */}
                <Card className="col-span-4 border-chart-5/20">
                    <CardHeader>
                        <CardTitle className="text-chart-5">Meal Distribution by Category</CardTitle>
                        <CardDescription>Number of meals in each category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mealDistribution.map((category, _) => (
                                <div key={category.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{category.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{category.count} meals</span>
                                            <Badge
                                                variant="secondary"
                                                className="bg-chart-1 text-primary-foreground"
                                            >
                                                {category.percentage.toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress
                                        value={category.percentage}
                                        className="h-2 bg-muted"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Article Distribution */}
                <Card className="col-span-3 border-chart-4/20">
                    <CardHeader>
                        <CardTitle className="text-chart-4">Article Distribution</CardTitle>
                        <CardDescription>By categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {articleDistribution.map((category, _) => (
                                <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg border-chart-3/20 bg-gradient-to-r from-card to-chart-3/5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-chart-3/20 flex items-center justify-center">
                                            <span className="text-xs font-medium text-chart-3">A</span>
                                        </div>
                                        <span className="text-sm font-medium">{category.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-chart-3">{category.count}</div>
                                        <div className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Items */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Articles */}
                <Card className="col-span-3 border-chart-2/20">
                    <CardHeader>
                        <CardTitle className="text-chart-2">Recent Articles</CardTitle>
                        <CardDescription>Last 5 added articles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentArticles.map((article) => (
                                <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg border-chart-2/20 bg-gradient-to-r from-card to-chart-2/5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-chart-2/20 flex items-center justify-center">
                                            <span className="text-sm font-medium text-chart-2">A</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none line-clamp-1">{article.title}</p>
                                            <p className="text-xs text-muted-foreground">{article.articleCategoryName}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="border-chart-2 text-chart-2">Article</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Meals */}
                <Card className="col-span-4 border-chart-1/20">
                    <CardHeader>
                        <CardTitle className="text-chart-1">Recent Meals</CardTitle>
                        <CardDescription>Last 5 added meals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentMeals.map((meal) => (
                                <div key={meal.id} className="flex items-center justify-between p-3 border rounded-lg border-chart-1/20 bg-gradient-to-r from-card to-chart-1/5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-chart-1/20 flex items-center justify-center">
                                            <span className="text-sm font-medium text-chart-1">M</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{meal.name}</p>
                                            <p className="text-xs text-muted-foreground">{meal.mealCategoryName}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="border-chart-1 text-chart-1">Meal</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}