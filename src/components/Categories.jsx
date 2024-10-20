import React, { useState, useEffect } from 'react';

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);
  const [displayedCategories, setDisplayedCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('https://dummyjson.com/recipes/meal-type/snack')
      .then(res => res.json())
      .then(data => {
        const uniqueCategories = data.recipes.reduce((acc, recipe) => {
          if (!acc.find(cat => cat.mealType === recipe.mealType)) {
            acc.push({
              mealType: recipe.mealType,
              image: recipe.image || `error`
            });
          }
          return acc;
        }, []);
        setCategories(uniqueCategories);
        setDisplayedCategories(uniqueCategories.slice(0, 8));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  return (
    <div className="container mx-auto max-w-screen-lg px-4 p-8 md:p-16 cursor-pointer ">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Popular Categories</h2>
        {categories.length > 8 && (
          <button 
            onClick={toggleView} 
            className="text-[#B55D51] hover:underline"
          >
            {showAll ? 'View less' : 'View more'}
          </button>
        )}
      </div>
      <div className=" grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayedCategories.map((category, index) => (
          <div key={index} className="text-center ">
            <img 
              src={category.image} 
              alt={category.mealType} 
              className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
            />
            <p>{category.mealType}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;