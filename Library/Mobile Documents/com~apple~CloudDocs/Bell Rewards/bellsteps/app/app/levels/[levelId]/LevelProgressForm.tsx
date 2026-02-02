'use client';

import { useState, useTransition } from 'react';
import { updateProgress } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import type { ProgressStatus } from '@/lib/types';

interface LevelProgressFormProps {
  levelId: string;
  currentStatus: ProgressStatus;
  currentNotes: string;
}

export function LevelProgressForm({ levelId, currentStatus, currentNotes }: LevelProgressFormProps) {
  const [status, setStatus] = useState<ProgressStatus>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('levelId', levelId);
        formData.append('status', status);
        formData.append('notes', notes);
        await updateProgress(formData);
        toast.success('Progress updated!');
      } catch (error) {
        toast.error('Failed to update progress');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Update Progress</h3>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProgressStatus)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="locked">Locked</option>
            <option value="in_progress">In Progress</option>
            <option value="achieved">Achieved</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <input
            id="notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Teacher notes..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
