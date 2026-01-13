import { useState, useCallback } from 'react';
import { Project } from '../../types';
import { ProjectsAPI } from '../../services/api';

/**
 * Custom hook for project management
 * Tách logic projects ra khỏi DataContext để dễ maintain
 */
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProjectsAPI.getAll();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (project: Project) => {
    try {
      const newProject = await ProjectsAPI.create(project);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (updatedProject: Project) => {
    try {
      await ProjectsAPI.update(updatedProject.id, updatedProject);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await ProjectsAPI.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    projects,
    loading,
    error,
    loadProjects,
    addProject,
    updateProject,
    deleteProject
  };
};