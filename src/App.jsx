import { useState } from 'react';
import './App.css';
import DashboardLayoutBasic from "./components/DashboardLayoutBasic";
import 'cesium/Source/Widgets/widgets.css';
import LandingPage from "./components/LandingPage";

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleEnterPlan = () => {
    setShowDashboard(true);
  };

  return (
    <>
      {!showDashboard ? (
        <LandingPage onEnterPlan={handleEnterPlan} />
      ) : (
        <DashboardLayoutBasic />
      )}
    </>
  );
}

export default App;