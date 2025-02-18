import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image, Button, Spin, Rate, Checkbox } from "antd";
import { ArrowLeft } from "lucide-react";
import Header from '../components/Header';
import Footer from "../components/Footer";
import DetailPageCard from "../components/DetailPageCard";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [youMightLike, setYouMightLike] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch main recipe
        const recipeResponse = await fetch(`https://dummyjson.com/recipes/${id}`);
        if (!recipeResponse.ok) {
          throw new Error('Recipe not found');
        }
        const recipeData = await recipeResponse.json();
        setRecipe(recipeData);

        // Fetch similar recipes
        const similarResponse = await fetch('https://dummyjson.com/recipes?limit=4');
        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          // Filter out the current recipe and get only 3 recipes
          const filteredRecipes = similarData.recipes
            .filter(recipe => recipe.id !== parseInt(id))
            .slice(0, 3);
          setYouMightLike(filteredRecipes);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-screen-lg px-4">
        <Header />
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold text-red-600">{error}</h2>
          <Button onClick={handleGoBack} className="mt-4">
            Go Back
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-lg px-4">
      <Header />
      <Button 
        onClick={handleGoBack} 
        icon={<ArrowLeft className="h-4 w-4" />} 
        className="mb-4"
      >
        Back to <span className="text-[#B55D51]">Recipes</span>
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Recipe Title and Rating */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-4xl font-bold">{recipe?.name}</h1>
          <Rate 
            disabled 
            defaultValue={recipe?.rating || 0} 
            className="my-4" 
          />
        </div>

        {/* Recipe Image and Details */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col items-center">
            <Image
              src={recipe?.image}
              alt={recipe?.name}
              className="w-[90%] h-[90%] object-cover rounded-lg"
              fallback="data:image/png;base64,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"
            />
            <div className="flex justify-center items-center mt-6 gap-8">
              <div className="text-center">
                <h1 className="text-gray-500">Prep Time:</h1>
                <h1>{recipe?.prepTimeMinutes} mins</h1>
              </div>
              <div className="text-center">
                <h1 className="text-gray-500">Cook Time:</h1>
                <h1>{recipe?.cookTimeMinutes} mins</h1>
              </div>
              <div className="text-center">
                <h1 className="text-gray-500">Servings:</h1>
                <h1>{recipe?.servings}</h1>
              </div>
            </div>
            <button className="mt-6 px-5 py-2 rounded-lg text-sm text-[#B55D51] border border-[#B55D51] hover:bg-[#974E44] hover:text-white transition-colors">
              Print Recipe
            </button>
          </div>

          {/* Recipe Info */}
          <div>
            <p className="text-gray-600 mb-4">{recipe?.description}</p>
            <div className="mb-4">
              <span className="font-semibold">Tags:</span> {recipe?.tags?.join(', ')}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Difficulty:</span> {recipe?.difficulty}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Cuisine:</span> {recipe?.cuisine}
            </div>
            <div>
              <span className="font-semibold">Meal Type:</span> {recipe?.mealType}
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Ingredients:</h2>
          <ul className="list-disc pl-6">
            {recipe?.ingredients?.map((ingredient, index) => (
              <li key={index} className="flex items-center my-1">
                <Checkbox className="mr-2" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal pl-6">
            {recipe?.instructions?.map((instruction, index) => (
              <li key={index} className="flex items-center my-1">
                <Checkbox className="mr-2" />
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* You Might Like */}
      {youMightLike.length > 0 && (
        <div className="my-16">
          <h1 className="text-2xl font-semibold">You might like</h1>
          <section className="container mx-auto text-gray-600 body-font">
            <div className="flex flex-wrap py-10">
              {youMightLike.map((item) => (
                <DetailPageCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default RecipeDetail;