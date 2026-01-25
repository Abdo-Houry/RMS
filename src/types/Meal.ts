export interface MealIngredient {
    id: string; // معرف الوصفة داخل الوجبة
    ingredientId: string; // معرف المكون
    name: string;
    imagePath: string;
    quantity: number;
}

// export interface Meal {
//     id: string;
//     name: string;
//     description: string;
//     imagePath: string;
//     mealCategoryId: string;
//     mealCategoryName: string;
//     ingredients?: MealIngredient[];
// }
interface MealImage {
    index: number;
    image: string;
}

export interface Meal {
    id: string;
    name: string;
    images: MealImage[];
    mealCategoryId: string;
    mealCategoryName: string;
    createdAt: string;
    description?: string;
    ingredients?: any[];
    videos?: any[];
}