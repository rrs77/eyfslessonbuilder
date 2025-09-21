import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CurriculumTarget {
  id: string;
  subject: string;
  yearGroup: string;
  domain: string;
  statement: string;
  category?: string;
}

export interface CurriculumDomain {
  [domainName: string]: string[];
}

export interface YearGroupTargets {
  domains: CurriculumDomain;
}

export interface SubjectTargets {
  name: string;
  yearGroups: {
    [yearGroup: string]: YearGroupTargets;
  };
}

export interface CurriculumTargetsData {
  [subject: string]: SubjectTargets;
}

interface CurriculumContextType {
  curriculumTargets: CurriculumTargetsData;
  loading: boolean;
  error: string | null;
  getTargetsForSubject: (subject: string) => SubjectTargets | null;
  getTargetsForYearGroup: (subject: string, yearGroup: string) => YearGroupTargets | null;
  getTargetsForDomain: (subject: string, yearGroup: string, domain: string) => string[] | null;
  getAllYearGroups: (subject: string) => string[];
  getAllDomains: (subject: string, yearGroup: string) => string[];
  getAllSubjects: () => string[];
  searchTargets: (query: string, subject?: string, yearGroup?: string) => CurriculumTarget[];
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const [curriculumTargets, setCurriculumTargets] = useState<CurriculumTargetsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCurriculumData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/curriculumTargets.json');
        if (!response.ok) {
          throw new Error('Failed to load curriculum data');
        }
        const data = await response.json();
        setCurriculumTargets(data);
        setError(null);
      } catch (err) {
        console.error('Error loading curriculum data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load curriculum data');
      } finally {
        setLoading(false);
      }
    };

    loadCurriculumData();
  }, []);

  const getTargetsForSubject = (subject: string): SubjectTargets | null => {
    return curriculumTargets[subject] || null;
  };

  const getTargetsForYearGroup = (subject: string, yearGroup: string): YearGroupTargets | null => {
    const subjectTargets = getTargetsForSubject(subject);
    if (!subjectTargets) return null;
    return subjectTargets.yearGroups[yearGroup] || null;
  };

  const getTargetsForDomain = (subject: string, yearGroup: string, domain: string): string[] | null => {
    const yearGroupTargets = getTargetsForYearGroup(subject, yearGroup);
    if (!yearGroupTargets) return null;
    return yearGroupTargets.domains[domain] || null;
  };

  const getAllYearGroups = (subject: string): string[] => {
    const subjectTargets = getTargetsForSubject(subject);
    if (!subjectTargets) return [];
    return Object.keys(subjectTargets.yearGroups).sort();
  };

  const getAllDomains = (subject: string, yearGroup: string): string[] => {
    const yearGroupTargets = getTargetsForYearGroup(subject, yearGroup);
    if (!yearGroupTargets) return [];
    return Object.keys(yearGroupTargets.domains).sort();
  };

  const getAllSubjects = (): string[] => {
    return Object.keys(curriculumTargets).sort();
  };

  const searchTargets = (query: string, subject?: string, yearGroup?: string): CurriculumTarget[] => {
    const results: CurriculumTarget[] = [];
    const searchQuery = query.toLowerCase();

    const subjectsToSearch = subject ? [subject] : Object.keys(curriculumTargets);

    subjectsToSearch.forEach(subj => {
      const subjectTargets = getTargetsForSubject(subj);
      if (!subjectTargets) return;

      const yearGroupsToSearch = yearGroup ? [yearGroup] : Object.keys(subjectTargets.yearGroups);

      yearGroupsToSearch.forEach(yrGroup => {
        const yearGroupTargets = getTargetsForYearGroup(subj, yrGroup);
        if (!yearGroupTargets) return;

        Object.entries(yearGroupTargets.domains).forEach(([domain, statements]) => {
          statements.forEach((statement, index) => {
            if (statement.toLowerCase().includes(searchQuery)) {
              results.push({
                id: `${subj}-${yrGroup}-${domain}-${index}`,
                subject: subj,
                yearGroup: yrGroup,
                domain: domain,
                statement: statement
              });
            }
          });
        });
      });
    });

    return results;
  };

  const value = {
    curriculumTargets,
    loading,
    error,
    getTargetsForSubject,
    getTargetsForYearGroup,
    getTargetsForDomain,
    getAllYearGroups,
    getAllDomains,
    getAllSubjects,
    searchTargets
  };

  return (
    <CurriculumContext.Provider value={value}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
}



