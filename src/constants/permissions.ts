// ملف لتحديد جميع صلاحيات النظام بناءً على Enum المقدم
export const PERMISSIONS = {
    // صلاحيات المستخدمين (Users)
    USERS: {
        CREATE: 1,      // CreateUser
        UPDATE: 2,      // UpdateUser
        DELETE: 3,      // DeleteUser
        SHOW: 4,        // ShowUser
        SET_PERMISSIONS: 5, // SetPermissions
    },

    // صلاحيات الوجبات (Meals)
    MEALS: {
        CREATE: 6,      // CreateMeal
        UPDATE: 7,      // UpdateMeal
        DELETE: 8,      // DeleteMeal
        SHOW: 9,        // ShowMeal
    },

    // صلاحيات فئات الوجبات (Meal Categories)
    MEAL_CATEGORIES: {
        CREATE: 10,     // CreateMealCategory
        UPDATE: 11,     // UpdateMealCategory
        DELETE: 12,     // DeleteMealCategory
        SHOW: 13,       // ShowMealCategory
    },

    // صلاحيات الماركات (Brands)
    BRANDS: {
        CREATE: 14,     // CreateBrand
        UPDATE: 15,     // UpdateBrand
        DELETE: 16,     // DeleteBrand
        SHOW: 17,       // ShowBrand
    },

    // صلاحيات المكونات (Ingredients)
    INGREDIENTS: {
        CREATE: 18,     // CreateIngredient
        UPDATE: 19,     // UpdateIngredient
        DELETE: 20,     // DeleteIngredient
        SHOW: 21,       // ShowIngredient
    },

    // صلاحيات الآلات (Machines)
    MACHINES: {
        CREATE: 22,     // CreateMachine
        UPDATE: 23,     // UpdateMachine
        DELETE: 24,     // DeleteMachine
        SHOW: 25,       // ShowMachine
    },

    // صلاحيات المقالات (Articles)
    ARTICLES: {
        CREATE: 26,     // CreateArticle
        UPDATE: 27,     // UpdateArticle
        DELETE: 28,     // DeleteArticle
        SHOW: 29,       // ShowArticle
    },

    // صلاحيات فئات المقالات (Article Categories)
    ARTICLE_CATEGORIES: {
        CREATE: 30,     // CreateArticleCategory
        UPDATE: 31,     // UpdateArticleCategory
        DELETE: 32,     // DeleteArticleCategory
        SHOW: 33,       // ShowArticleCategory
    },

    // صلاحيات الوحدات (Units)
    UNITS: {
        CREATE: 34,     // CreateUnits
        UPDATE: 35,     // UpdateUnits
        DELETE: 36,     // DeleteUnits
        SHOW: 37,       // ShowUnits
    },
} as const