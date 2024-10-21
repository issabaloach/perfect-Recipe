import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {  collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { storage, ref, deleteObject } from 'firebase/storage';


function Profile() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserRecipes(currentUser.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserRecipes = async (userId) => {
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const userRecipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRecipes(userRecipes);
  };

  const deleteRecipe = async (recipeId, imageUrl) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'recipes', recipeId));

      // Delete image from Storage if it exists
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      // Update local state
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-screen-lg px-4">
      <Header />
      <div className="my-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        {user && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <img 
                src={user.photoURL || 'https://via.placeholder.com/100'} 
                alt="Profile" 
                className="w-20 h-20 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{user.displayName}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">My Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img 
                src={recipe.imageUrl || 'https://via.placeholder.com/300x200'} 
                alt={recipe.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">{recipe.description.slice(0, 100)}...</p>
                <button 
                  onClick={() => deleteRecipe(recipe.id, recipe.imageUrl)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;