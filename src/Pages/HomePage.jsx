import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import ShareRecipes from "./ShareRecipe";
import TrendingRecipes from "./TrendRecipe";
import ExploreRecipes from './ExploreRecipe';
import Newsletter from "../components/NewsLetter";
import PopularCategories from "../components/Categories";
import Brands from "../components/Brands";

function HomePage() {
    return (
        <>
        
            <Header />
            <main >
                <HeroSection />
                <ShareRecipes />
                <TrendingRecipes />
                <ExploreRecipes />
                <Newsletter />
                <PopularCategories />
                <Brands />
            </main>
            <Footer />
        </>
    );
}

export default HomePage;