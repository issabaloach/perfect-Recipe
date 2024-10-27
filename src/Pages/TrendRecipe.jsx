import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TrendingRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recipesPerPage = 6;

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://dummyjson.com/recipes?limit=8&skip=8&select=name,image');
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  const handleViewMore = () => {
    setPage(prevPage => prevPage + 1);
    
  };

  const displayedRecipes = recipes.slice(0, page * recipesPerPage);

  return (
    <div className="container mx-auto max-w-screen-lg px-4 p-8 md:p-16 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Trending Recipes</h2>
        {displayedRecipes.length < recipes.length && (
          <button
            onClick={handleViewMore}
            className="text-red-500 hover:underline"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'View more'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedRecipes.map((recipe) => (
          <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg hover:scale-105">
            <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{recipe.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <img src="/api/placeholder/24/24" alt="User" className="w-6 h-6 rounded-full mr-2" />
                <span>{recipe.cuisine}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-1">★</span>
                <span className="mr-4">{(Math.random() * (5 - 4) + 4).toFixed(1)}</span>
                <span className="mr-1">🕒</span>
                <span>{recipe.cookTimeMinutes} min</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingRecipes;