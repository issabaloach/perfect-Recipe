import { Link } from "react-router-dom";

function ShareRecipes() {
  return (
    <div className="container mx-auto max-w-screen-lg px-4 p-8 md:p-16 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2">
        <img
          src="https://plus.unsplash.com/premium_photo-1666920345410-8c9ca9b3c318?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Share Recipe"
          className="ml-4 rounded-lg shadow-lg h-[400px]"
        />
      </div>
      <div className=" text-center md:w-1/2 mb-8 md:mb-0">
        <h2 className="text-3xl font-bold mb-4">
          Share Your <span className="text-[#B55D51] font-bold">Recipes</span>
        </h2>
        <p className="mb-6">
        Create and save a new dish to your collection.
        </p>
        <Link to='/add-recipe'>
        <button className="bg-[#B55D51] text-white px-6 py-3 rounded-md text-sm">
          Create New Recipe
        </button>
        </Link>
       
      </div>
    </div>
  );
}

export default ShareRecipes;
