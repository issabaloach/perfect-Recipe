import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, deleteObject, getDownloadURL } from 'firebase/storage';
import { db } from '../utils/firebase';
import { Spinner } from '@nextui-org/react';

function Profile() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImageError, setProfileImageError] = useState(false);
  const navigate = useNavigate();
  const storage = getStorage();

  const DEFAULT_PROFILE_IMAGE = 'https://c8.alamy.com/comp/2AER1CC/icon-icon-in-trendy-flat-style-isolated-on-background-logo-app-ui-profile-picture-person-avatar-user-eps-10-2AER1CC.jpg';

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const imageRef = ref(storage, `profile-images/${user.uid}`);
          const photoURL = await getDownloadURL(imageRef);
          setUser({
            ...user,
            photoURL: photoURL
          });
        } catch (error) {
          // Handle 404 error specifically
          if (error.code === 'storage/object-not-found') {
            setUser({
              ...user,
              photoURL: DEFAULT_PROFILE_IMAGE
            });
          } else {
            console.error("Error fetching profile image:", error);
            setUser({
              ...user,
              photoURL: DEFAULT_PROFILE_IMAGE
            });
          }
          setProfileImageError(true);
        }
        
        fetchUserRecipes(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate, storage]);

  const fetchUserRecipes = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const recipesRef = collection(db, 'recipes');
      const q = query(recipesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const userRecipes = [];
      querySnapshot.forEach((doc) => {
        userRecipes.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(userRecipes);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setProfileImageError(true);
  };

  const deleteRecipe = async (recipeId, imageUrl) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'recipes', recipeId));

      // Delete image from Storage if it exists
      if (imageUrl) {
        const imageUrlPath = imageUrl.split('recipe-images/')[1];
        if (imageUrlPath) {
          const imageRef = ref(storage, `recipe-images/${imageUrlPath}`);
          try {
            await deleteObject(imageRef);
          } catch (storageError) {
            console.error("Error deleting image:", storageError);
          }
        }
      }
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-screen-lg px-4">
        <Header />
        <div className="my-8 text-center">
          <Spinner className="text-xl"/>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-screen-lg px-4">
        <Header />
        <div className="my-8 text-center">
          <p className="text-xl text-red-500">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-lg px-4">
      <Header />
      <div className="my-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        {user && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <img 
                src={profileImageError ? DEFAULT_PROFILE_IMAGE : (user.photoURL || DEFAULT_PROFILE_IMAGE)}
                alt="Profile" 
                className="w-20 h-20 rounded-full mr-4 object-cover"
                onError={handleImageError}
              />
              <div>
                <h2 className="text-xl font-semibold">{user.displayName}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Recipes</h2>
          <button 
            onClick={() => navigate('/add-recipe')}
            className="bg-[#FFF0ED] text-black px-4 py-2 rounded hover:bg-[#974E44] hover:text-white transition duration-300"
          >
            Add New Recipe
          </button>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">You haven't created any recipes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <div key={recipe.id} className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg hover:scale-105">
                <img 
                  src={recipe.imageUrl || 'https://via.placeholder.com/300x200'} 
                  alt={recipe.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {recipe.description ? 
                      (recipe.description.length > 100 ? 
                        `${recipe.description.slice(0, 100)}...` : 
                        recipe.description) : 
                      'No description provided'}
                  </p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this recipe?')) {
                          deleteRecipe(recipe.id, recipe.imageUrl);
                        }
                      }}
                      className="bg-[#FFF0ED] text-black px-4 py-2 rounded hover:bg-[#974E44] hover:text-white transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Profile;