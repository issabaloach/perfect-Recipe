import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Spin, Alert } from 'antd';
import { AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ExploreRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    fetchRecipes();
  }, [currentPage]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * pageSize;
      const response = await fetch(`https://dummyjson.com/recipes?limit=${pageSize}&skip=${skip}&select=id,name,image`);
      const data = await response.json();
      setRecipes(data.recipes);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
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
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{recipe.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <img src="/api/placeholder/24/24" alt="User" className="w-6 h-6 rounded-full mr-2" />
                    <span>Chef {index + 1}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-1">★</span>
                    <span className="mr-4">{(Math.random() * (5 - 4) + 4).toFixed(1)}</span>
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