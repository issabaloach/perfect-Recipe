import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image, Button, Spin } from "antd";
import { ArrowLeft } from "lucide-react";
import Header from '../components/Header';
import { data } from "autoprefixer";
import Footer from "../components/Footer";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://dummyjson.com/recipes/${id}`);
        if (!response.ok) {
          throw new Error('Recipe not found');
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="medium" />
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
        Back to <span className="text-[#B55D51]" >Recipes</span>
      </Button>
      <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-4xl font-bold mb-4">{recipe?.name}</h1>
        <Image
          preview={false}
          src={recipe?.image}
          alt={recipe?.name}
          height={400}
          width="80%"
          className="object-cover rounded-lg mb-6"
        />
        <p className="text-gray-600 mb-4">{recipe?.description}</p>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Ingredients:</h2>
          <ul className="list-disc pl-6">
            {recipe?.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal pl-6">
            {recipe?.instructions.map((instruction, index) => (
              <li key={index} className="mb-2">{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default RecipeDetail;