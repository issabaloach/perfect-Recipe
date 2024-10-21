import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pagination, Spin, Alert, Select, Input } from "antd";
import { AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const ExploreRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(0);
  const pageSize = 9;

  // Search Recipe
  useEffect(() => {
    axios
      .get(`https://dummyjson.com/recipes/search?q=${search}`)
      .then((res) => {
        setRecipes(res.data.recipes);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [search]);

  useEffect(() => {
    fetchRecipes();
  }, [currentPage]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * pageSize;
      const response = await fetch(
        `https://dummyjson.com/recipes?limit=${pageSize}&skip=${skip}&select=id,name,image`
      );
      const data = await response.json();
      setRecipes(data.recipes);
      setTotal(data.total);
    } catch (err) {
      setError("Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto max-w-screen-lg px-4">
      <Header />

      <Input
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        type="text"
        placeholder="Search Recipe"
        className="mt-6 sm:w-[350px] md:w-[400px] lg:w-[450px] border-2 border-[#f5dbd5] px-2 py-1 rounded-md focus:outline-[#B55D51]"
      />

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          icon={<AlertCircle className="h-4 w-4" />}
          className="mb-4"
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64 ">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => (
              <Link
                to={`/recipe/${recipe.id}`}
                key={recipe.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg hover:scale-105"
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{recipe.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <img
                      src="/api/placeholder/24/24"
                      alt="User"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>Chef {index + 1}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-1">★</span>
                    <span className="mr-4">
                      {(Math.random() * (5 - 4) + 4).toFixed(1)}
                    </span>
                    <span className="mr-1">🕒</span>
                    <span>{Math.floor(Math.random() * 60) + 15} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default ExploreRecipes;
