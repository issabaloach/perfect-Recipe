import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./Pages/HomePage";
import Recipes from "./Pages/Recipes";
import AddRecipe from "./Pages/AddRecipe";
import AboutUs from "./Pages/AboutUs";
import RecipeDetail from './Pages/RecipeDetail';
import Profile from './Pages/Profile';
import { SiGnuprivacyguard } from 'react-icons/si';
import NotFound from './Pages/NotFound';
import SignUp from './Pages/Auth/SignUp';
import SignIn from './Pages/Auth/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="recipe/:id" element={<RecipeDetail />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<SignIn/>}/>
      </Routes>
    </Router>
  );
}

export default App;