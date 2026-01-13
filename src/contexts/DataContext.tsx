import React, { createContext, useContext, useEffect, useState } from 'react';
import { DonationsAPI, FundsAPI, NewsAPI, ProjectsAPI, VolunteersAPI } from '../services/api';
import { DonationRecord, Fund, NewsItem, Project, Volunteer } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  projects: Project[];
  volunteers: Volunteer[];
  donations: DonationRecord[];
  news: NewsItem[];
  funds: Fund[];
  statistics: {
    totalRaised: number;
    totalDonors: number;
    totalProjets: number;
  };
  loading: boolean;
  error: string | null;
  // Project Actions
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  // Volunteer Actions
  addVolunteer: (volunteer: Omit<Volunteer, 'id' | 'status' | 'date'>) => Promise<void>;
  updateVolunteerStatus: (id: number, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  // News Actions
  addNews: (news: NewsItem) => Promise<void>;
  updateNews: (news: NewsItem) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  // Donation Actions
  addDonation: (record: Omit<DonationRecord, 'id' | 'date'>) => Promise<void>;
  // Refresh
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [statistics, setStatistics] = useState({ totalRaised: 0, totalDonors: 0, totalProjets: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all data from API
   */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsData, volunteersData, donationsData, newsData, fundsData, totalRaisedData] =
        await Promise.all([
          ProjectsAPI.getAll(),
          (user?.role === 'admin' ? VolunteersAPI.getAll() : Promise.resolve([])).catch(() => []),
          DonationsAPI.getAll(100),
          NewsAPI.getAll(),
          FundsAPI.getAll(),
          DonationsAPI.getTotalRaised(),
        ]);

      setProjects(projectsData);
      setVolunteers(volunteersData);
      setDonations(donationsData);
      setNews(newsData);
      setFunds(fundsData);

      // Calculate derived statistics
      const calculatedStats = {
        totalRaised: totalRaisedData,
        totalDonors: projectsData.reduce((acc, curr) => acc + (curr.donors || 0), 0),
        // For distributed, we currently don't have a DB field, so we'll use a placeholder or config
        // For now, let's estimate it or leave it to be handled by the UI
        totalProjets: projectsData.length,
      };
      setStatistics(calculatedStats);
    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount or when user changes
  useEffect(() => {
    loadData();
  }, [user]);

  // --- Project Actions ---
  const addProject = async (project: Project) => {
    try {
      const newProject = await ProjectsAPI.create(project);
      setProjects((prev) => [newProject, ...prev]);
    } catch (err: any) {
      console.error('Failed to add project:', err);
      throw err;
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      await ProjectsAPI.update(updatedProject.id, updatedProject);
      setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    } catch (err: any) {
      console.error('Failed to update project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await ProjectsAPI.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      throw err;
    }
  };

  // --- Volunteer Actions ---
  const addVolunteer = async (data: Omit<Volunteer, 'id' | 'status' | 'date'>) => {
    try {
      const newVolunteer: Omit<Volunteer, 'id'> = {
        ...data,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      };
      const created = await VolunteersAPI.create(newVolunteer);
      setVolunteers((prev) => [created, ...prev]);
    } catch (err: any) {
      console.error('Failed to add volunteer:', err);
      throw err;
    }
  };

  const updateVolunteerStatus = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
    try {
      await VolunteersAPI.updateStatus(id, status);
      setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    } catch (err: any) {
      console.error('Failed to update volunteer status:', err);
      throw err;
    }
  };

  // --- News Actions ---
  const addNews = async (item: NewsItem) => {
    try {
      const newItem = await NewsAPI.create(item);
      setNews((prev) => [newItem, ...prev]);
    } catch (err: any) {
      console.error('Failed to add news:', err);
      throw err;
    }
  };

  const updateNews = async (item: NewsItem) => {
    try {
      await NewsAPI.update(item.id, item);
      setNews((prev) => prev.map((n) => (n.id === item.id ? item : n)));
    } catch (err: any) {
      console.error('Failed to update news:', err);
      throw err;
    }
  };

  const deleteNews = async (id: string) => {
    try {
      await NewsAPI.delete(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      console.error('Failed to delete news:', err);
      throw err;
    }
  };

  // --- Donation Actions ---
  const addDonation = async (record: Omit<DonationRecord, 'id' | 'date'>) => {
    try {
      const newDonation: Omit<DonationRecord, 'id'> = {
        ...record,
        date: new Date().toISOString().split('T')[0],
      };

      // 1. Add to database
      const created = await DonationsAPI.create(newDonation);
      setDonations((prev) => [created, ...prev]);

      // 2. Update project stats (in memory - backend should handle this via trigger)
      // 2. Update project stats (Optimistic UI update / Sync with backend logic)
      const targetProject = projects.find((p) => p.title === record.projectTitle);
      if (targetProject) {
        const updatedProject = {
          ...targetProject,
          raised: targetProject.raised + record.amount,
          donors: targetProject.donors + 1,
        };
        // We do NOT call ProjectsAPI.update here because the backend 'addDonation' endpoint
        // already handles the increment. We just update the local view.
        setProjects((prev) => prev.map((p) => (p.id === targetProject.id ? updatedProject : p)));
      }
    } catch (err: any) {
      console.error('Failed to add donation:', err);
      throw err;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        volunteers,
        donations,
        news,
        funds,
        statistics,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        addVolunteer,
        updateVolunteerStatus,
        addNews,
        updateNews,
        deleteNews,
        addDonation,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
