import ArticleDetailsPage from "@/components/articles/Details";
import CreateArticle from "@/components/articles/modules/Add";
import EditArticlePage from "@/components/articles/modules/Edit";
import RequireAuth from "@/components/auth/RequireAuth";
import AddMachinePage from "@/components/machines/modules/Add";
import DetailsMachine from "@/components/machines/modules/Details";
import EditMachine from "@/components/machines/modules/Edit";
import MealDetailsPage from "@/components/meals/Detsils";
import AddMealPage from "@/components/meals/modules/Add";
import EditMealPage from "@/components/meals/modules/Edit";
import Layout from "@/layout/Layout";
import Article from "@/pages/Article";
import LoginAdmin from "@/pages/auth/LoginAdmin";
import Brands from "@/pages/Brands";
import Categories from "@/pages/Categories";
import CategoriesMeal from "@/pages/CategoriesMeal";
import Home from "@/pages/Home";
import Ingredient from "@/pages/Ingredient";
import Machines from "@/pages/Machines";
import Meals from "@/pages/Meals";
import Settings from "@/pages/Settings";
import Units from "@/pages/Units";
import Users from "@/pages/Users";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

export const routes = createBrowserRouter(createRoutesFromElements(
    <Route>

        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
            {/* <Route index element={<Dashboard />} /> */}
            <Route index element={<Home />} />
            <Route path="article" element={<Article />} />
            <Route path="article/:id" element={<ArticleDetailsPage />} />
            <Route path="/articles/create" element={<CreateArticle />} />
            <Route path="articles/edit/:id" element={<EditArticlePage />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ingredient" element={<Ingredient />} />
            <Route path="units" element={<Units />} />
            <Route path="categories-meal" element={<CategoriesMeal />} />
            <Route path="machines" element={<Machines />} />
            <Route path="/machines/add" element={<AddMachinePage />} />
            <Route path="/machines/edit/:id" element={<EditMachine />} />
            <Route path="/machines/details/:id" element={<DetailsMachine />} />
            <Route path="meals" element={<Meals />} />
            <Route path="/meals/:id" element={<MealDetailsPage />} />
            <Route path="/meals/add" element={<AddMealPage />} />
            <Route path="/meals/edit/:id" element={<EditMealPage />} />
            <Route path="users" element={<Users />} />
            <Route path="brands" element={<Brands />} />
        </Route>

        <Route path="auth">
            <Route path="login-admin" element={<LoginAdmin />} />
        </Route>

    </Route>
))
