// Utility functions for data formatting, validation, etc.
import { VitalSigns } from '../types';

// Format date to display format
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString();
}

// Format time to display format
export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString();
}

// Format date and time together
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return `${formatDate(d)} ${formatTime(d)}`;
}

// Check if a vital sign reading is outside normal range
export function isAbnormalReading(reading: VitalSigns): boolean {
  const { readings } = reading;
  
  // Example thresholds - these would be configurable in a real app
  if (readings.heartRate && (readings.heartRate < 60 || readings.heartRate > 100)) {
    return true;
  }
  
  if (readings.bloodPressureSystolic && readings.bloodPressureDiastolic) {
    if (readings.bloodPressureSystolic > 140 || readings.bloodPressureDiastolic > 90) {
      return true;
    }
    if (readings.bloodPressureSystolic < 90 || readings.bloodPressureDiastolic < 60) {
      return true;
    }
  }
  
  if (readings.temperature) {
    if (readings.temperature > 38 || readings.temperature < 36) {
      return true;
    }
  }
  
  if (readings.oxygenSaturation && readings.oxygenSaturation < 95) {
    return true;
  }
  
  return false;
}

// Calculate age from birth date
export function calculateAge(birthDate: string | Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}