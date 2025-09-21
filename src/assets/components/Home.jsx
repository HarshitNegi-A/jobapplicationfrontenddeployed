const Home = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to Job Application Tracker
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Manage your job applications efficiently with our tracker. 
        Keep track of companies, applications, reminders, and interview timelines — 
        all in one place. Visualize your progress with a dashboard and stay organized 
        throughout your job search journey.
      </p>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 inline-block">
        <p className="text-indigo-700 font-medium">
          🚀 Start adding your applications and never miss a follow-up!
        </p>
      </div>
    </div>
  );
};

export default Home;
