// Basic types for our healthcare system

// Patient type
export interface Patient {
    id: string;
    name: string;
    email: string;
    phone?: string;
    birthDate: string;
    conditions?: string[];
    medication?: Medication[];
  }
  
  // Medical Staff
  export interface MedicalStaff {
    id: string;
    name: string;
    email: string;
    role: 'doctor' | 'nurse' | 'admin';
    department: string;
    specialization?: string;
  }
  
  // Vital signs tracking
  export interface VitalSigns {
    patientId: string;
    timestamp: string;
    readings: {
      heartRate?: number;
      bloodPressureSystolic?: number;
      bloodPressureDiastolic?: number;
      temperature?: number;
      oxygenSaturation?: number;
      respirationRate?: number;
      weight?: number;
    };
  }
  
  // Medication
  export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
  }
  
  // Appointment
  export interface Appointment {
    id: string;
    patientId: string;
    staffId: string;
    dateTime: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    type: 'checkup' | 'follow-up' | 'emergency' | 'regular';
  }
  
  // Alert
  export interface Alert {
    id: string;
    patientId: string;
    type: 'high' | 'low' | 'critical' | 'information';
    message: string;
    timestamp: string;
    readingType: string;
    readingValue: number;
    threshold: number;
    acknowledged: boolean;
  }