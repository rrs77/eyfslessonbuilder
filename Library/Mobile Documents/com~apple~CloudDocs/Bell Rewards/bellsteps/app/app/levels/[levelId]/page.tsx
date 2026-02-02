import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getLevelById } from '@/lib/levels';
import { getResourcesForLevel, getUserProgress, updateProgress } from '@/lib/actions';
import { BellIcon } from '@/components/BellIcon';
import { StatusBadge } from '@/components/StatusBadge';
import { ResourceCard } from '@/components/ResourceCard';
import { Tabs } from '@/components/Tabs';
import { Play, FileText, Eye, Grid, Gamepad2, ClipboardCheck, Heart } from 'lucide-react';
import type { ResourceType } from '@/lib/types';
import { LevelProgressForm } from './LevelProgressForm';

interface LevelPageProps {
  params: Promise<{ levelId: string }>;
}

export default async function LevelPage({ params }: LevelPageProps) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const { levelId } = await params;
  const level = await getLevelById(levelId);
  
  if (!level) {
    redirect('/app');
  }

  const progress = await getUserProgress(levelId);
  const status = progress?.status || 'locked';

  const tabs = [
    { id: 'all', label: 'All Resources', icon: <FileText className="w-5 h-5" /> },
    { id: 'video', label: 'Videos', icon: <Play className="w-5 h-5" /> },
    { id: 'pdf', label: 'Lesson Plans', icon: <FileText className="w-5 h-5" /> },
    { id: 'visual_cues', label: 'Visual Cues', icon: <Eye className="w-5 h-5" /> },
    { id: 'pattern_cards', label: 'Pattern Cards', icon: <Grid className="w-5 h-5" /> },
    { id: 'game', label: 'Games', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'assessment', label: 'Assessment', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'saved', label: 'Saved', icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          <BellIcon color={level.theme_color} size={80} />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2" style={{ color: level.theme_color }}>
              {level.title}
            </h1>
            <StatusBadge status={status} size="lg" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-4" style={{ borderColor: level.theme_color }}>
          <h2 className="text-3xl font-bold mb-4">✨ About This Level ✨</h2>
          <p className="text-xl text-gray-700 mb-4 leading-relaxed">{level.summary}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Goal</h3>
              <p className="text-gray-700">{level.goal}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Setup</h3>
              <p className="text-gray-700">
                {level.setup_json.bells} bell{level.setup_json.bells !== 1 ? 's' : ''} • {level.setup_json.grouping}
              </p>
              {level.setup_json.notes && (
                <p className="text-sm text-gray-600 mt-2">{level.setup_json.notes}</p>
              )}
            </div>
          </div>
        </div>

        <LevelProgressForm levelId={levelId} currentStatus={status} currentNotes={progress?.notes || ''} />
      </div>

      <Tabs tabs={tabs} defaultTab="all">
        {(activeTab) => {
          if (activeTab === 'pdf' && level.pdf_url) {
            return (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold mb-4">Lesson Plan Pack</h3>
                <p className="text-gray-600 mb-6">Download the complete lesson plan pack for this level</p>
                <a
                  href={level.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                  Open PDF
                </a>
              </div>
            );
          }

          if (activeTab === 'pdf' && !level.pdf_url) {
            return (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-bold mb-4">PDF Coming Soon</h3>
                <p className="text-gray-600">The lesson plan pack for this level is being prepared.</p>
              </div>
            );
          }

          return <ResourceList levelId={levelId} type={activeTab === 'all' ? undefined : activeTab as ResourceType | 'saved'} />;
        }}
      </Tabs>
    </div>
  );
}

async function ResourceList({ levelId, type }: { levelId: string; type?: ResourceType | 'saved' }) {
  const session = await auth();
  if (!session) return null;

  let resources = await getResourcesForLevel(levelId, type === 'saved' ? undefined : type);

  if (type === 'saved') {
    resources = resources.filter((r) => r.is_favourite);
  }

  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600 text-lg">No resources found for this section.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
