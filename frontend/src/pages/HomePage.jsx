import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome back, <span className="text-primary">{user?.username}</span>!</h1>
      <p className="text-gray-text mb-8">Here's a snapshot of your MediaVault.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-dark-alt p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-light">Total Media</h3>
          <p className="text-5xl font-extrabold text-primary mt-2">157</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-dark-alt p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-light">Books Read (2025)</h3>
          <p className="text-5xl font-extrabold text-primary mt-2">23</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-dark-alt p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-light">Active Loans</h3>
          <p className="text-5xl font-extrabold text-primary mt-2">3</p>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-dark-alt p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-light">Wishlist Items</h3>
          <p className="text-5xl font-extrabold text-primary mt-2">12</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">Recently Added</h2>
        {/* This will be a list/grid of media cards */}
        <div className="p-6 bg-dark-alt rounded-lg text-center shadow-md">
          <p className="text-gray-text">Recently added media will be displayed here.</p>
        </div>
      </div>

    </div>
  );
};

export default HomePage;