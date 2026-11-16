import Dexie, { type Table } from 'dexie';

export interface Homework {
  id?: number;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  userId: string;
}

export interface Exam {
  id?: number;
  title: string;
  subject: string;
  examDate: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  userId: string;
}

export interface StudySession {
  id?: number;
  subject: string;
  durationMinutes: number;
  date: string;
  userId: string;
}

export interface Activity {
  id?: number;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  userId: string;
}

export interface Task {
  id?: number;
  title: string;
  status: 'pending' | 'completed';
  userId: string;
}

export interface ClassSchedule {
  id?: number;
  day: string;
  subject: string;
  startTime: string;
  endTime: string;
  userId: string;
}

export class SherpiderDB extends Dexie {
  homework!: Table<Homework>;
  exams!: Table<Exam>;
  studySessions!: Table<StudySession>;
  activities!: Table<Activity>;
  tasks!: Table<Task>;
  classes!: Table<ClassSchedule>;

  constructor() {
    super('SherpiderDB');
    this.version(5).stores({
      homework: '++id, title, subject, dueDate, status, userId',
      exams: '++id, title, subject, examDate, priority, userId',
      studySessions: '++id, subject, date, userId',
      activities: '++id, title, category, date, userId',
      tasks: '++id, title, status, userId',
      classes: '++id, day, subject, userId'
    });
  }
}

export const db = new SherpiderDB();
