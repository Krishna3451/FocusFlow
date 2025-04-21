import { useState, useEffect } from 'react';
import { JournalEntry } from '../types/journal';
import { getJournalEntries, deleteJournalEntry } from '../utils/journalStorage';
import MainLayout from '../components/layout/MainLayout';
import GoalProgress, { Goal } from '../components/journey/GoalProgress';

const Journey: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Improve public speaking skills',
      progress: 45,
      dueDate: new Date('2025-06-30'),
    },
    {
      id: '2',
      title: 'Daily mindfulness practice',
      progress: 75,
      dueDate: new Date('2025-05-15'),
    },
    {
      id: '3',
      title: 'Learn JavaScript fundamentals',
      progress: 20,
      dueDate: new Date('2025-07-10'),
    },
  ];
  
  useEffect(() => {
    const loadEntries = () => {
      const journalEntries = getJournalEntries();
      setEntries(journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };
    loadEntries();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteJournalEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Journey</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Journal Entries</h2>
            <div className="space-y-2">
              {entries.map(entry => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-md cursor-pointer transition-colors ${
                    selectedEntry?.id === entry.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="font-medium">{new Date(entry.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-600 truncate">{entry.dailyReflection}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedEntry ? (
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-semibold">
                    {new Date(selectedEntry.date).toLocaleDateString()}
                  </h2>
                  <button
                    onClick={() => handleDelete(selectedEntry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete Entry
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Activities</h3>
                    <p className="mt-1">{selectedEntry.activities}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">Daily Reflection</h3>
                    <p className="mt-1">{selectedEntry.dailyReflection}</p>
                  </div>

                  {selectedEntry.pictureOfTheDay && (
                    <div>
                      <h3 className="font-medium text-gray-700">Picture of the Day</h3>
                      <img
                        src={selectedEntry.pictureOfTheDay}
                        alt="Picture of the day"
                        className="mt-2 max-w-full h-auto rounded-md"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-gray-700">Productivity Level</h3>
                    <p className="mt-1">{selectedEntry.productivity}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">Gratitude</h3>
                    <p className="mt-1">{selectedEntry.gratitude}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Spiritual Win</h3>
                      <p className="mt-1">{selectedEntry.spiritualWin}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Mental Win</h3>
                      <p className="mt-1">{selectedEntry.mentalWin}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Physical Win</h3>
                      <p className="mt-1">{selectedEntry.physicalWin}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">Learning of the Day</h3>
                    <p className="mt-1">{selectedEntry.learningOfTheDay}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select an entry to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Journey;
