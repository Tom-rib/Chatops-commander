import React from 'react';
import Card from '../components/ui/Card';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
        <p className="text-gray-400">Configuration de l'application</p>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Paramètres disponibles prochainement</h2>
        <p className="text-gray-400">Cette page sera complétée dans une prochaine version.</p>
      </Card>
    </div>
  );
};

export default Settings;