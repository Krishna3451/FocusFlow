import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProductivityLevel, JournalEntry } from '../types/journal';
import { saveJournalEntry } from '../utils/journalStorage';
import MainLayout from '../components/layout/MainLayout';

export default function Today() {
  const [formData, setFormData] = useState<Omit<JournalEntry, 'id' | 'createdAt'>>({
    date: new Date().toISOString().split('T')[0],
    activities: '',
    dailyReflection: '',
    pictureOfTheDay: '',
    productivity: 'Somewhat',
    gratitude: '',
    spiritualWin: '',
    mentalWin: '',
    physicalWin: '',
    learningOfTheDay: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: JournalEntry = {
      ...formData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    saveJournalEntry(entry);
    alert('Journal entry saved successfully!');
    // Reset form
    setFormData({
      ...formData,
      activities: '',
      dailyReflection: '',
      pictureOfTheDay: '',
      gratitude: '',
      spiritualWin: '',
      mentalWin: '',
      physicalWin: '',
      learningOfTheDay: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-owl-navy">Daily Reflection</h2>
              <p className="text-owl-navy/70">Take a moment to reflect on your day</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-owl-navy mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-owl-navy mb-2">What did I do today?</label>
            <textarea
              name="activities"
              value={formData.activities}
              onChange={handleChange}
              className="w-full p-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-owl-navy mb-2">Daily Reflection</label>
            <textarea
              name="dailyReflection"
              value={formData.dailyReflection}
              onChange={handleChange}
              className="w-full p-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-owl-navy mb-2">Picture of the Day (URL)</label>
            <input
              type="url"
              name="pictureOfTheDay"
              value={formData.pictureOfTheDay}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-owl-navy mb-2">Did I feel productive?</label>
            <select
              name="productivity"
              value={formData.productivity}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
              required
            >
              <option value="Yes">Yes</option>
              <option value="Somewhat">Somewhat</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-owl-navy mb-2">I am grateful for...</label>
            <textarea
              name="gratitude"
              value={formData.gratitude}
              onChange={handleChange}
              className="w-full p-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-owl-navy mb-2">Spiritual Win</label>
              <textarea
                name="spiritualWin"
                value={formData.spiritualWin}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-owl-navy mb-2">Mental Win</label>
              <textarea
                name="mentalWin"
                value={formData.mentalWin}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-owl-navy mb-2">Physical Win</label>
              <textarea
                name="physicalWin"
                value={formData.physicalWin}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-owl-navy mb-2">Something I learned today</label>
            <textarea
              name="learningOfTheDay"
              value={formData.learningOfTheDay}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-owl-blue focus:border-owl-blue"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-owl-blue text-white py-3 px-4 rounded-md hover:bg-owl-blue/90 transition-colors font-medium"
          >
            Save Journal Entry
          </button>
        </form>
      </div>
    </MainLayout>
  );
} 