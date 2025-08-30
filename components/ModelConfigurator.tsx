
import React from 'react';
import type { ModelConfig } from '../types';
import { GENDERS, AGES, ETHNICITIES, SETTINGS } from '../constants';

interface ModelConfiguratorProps {
  config: ModelConfig;
  setConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
}

interface SelectInputProps {
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const ModelConfigurator: React.FC<ModelConfiguratorProps> = ({ config, setConfig }) => {
  const handleChange = (field: keyof ModelConfig) => (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setConfig(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-200 mb-3">2. Configure Model</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput label="Gender" value={config.gender} options={GENDERS} onChange={handleChange('gender')} />
        <SelectInput label="Age Range" value={config.age} options={AGES} onChange={handleChange('age')} />
        <SelectInput label="Ethnicity" value={config.ethnicity} options={ETHNICITIES} onChange={handleChange('ethnicity')} />
        <SelectInput label="Setting / Background" value={config.setting} options={SETTINGS} onChange={handleChange('setting')} />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">Additional Details</label>
        <textarea
          value={config.details}
          onChange={handleChange('details')}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="e.g., smiling, wavy brown hair, professional lighting..."
        />
      </div>
    </div>
  );
};

export default ModelConfigurator;
