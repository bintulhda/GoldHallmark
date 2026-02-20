import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataPath = path.join(
  __dirname,
  '..',
  'data',
  'complaintsDatabase.json',
);

let complaintsData = {
  complaints: [],
};

// Load existing complaints
try {
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  complaintsData = JSON.parse(fileContents);
} catch (err) {
  console.warn('Could not load complaints database, using empty dataset.', err);
}

/**
 * Save complaint to mock database
 */
export const saveComplaintToDatabase = async (complaintData) => {
  try {
    const complaintId = `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const complaint = {
      id: complaintId,
      ...complaintData,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    complaintsData.complaints.push(complaint);

    // Save to file
    fs.writeFileSync(dataPath, JSON.stringify(complaintsData, null, 2), 'utf8');

    return {
      success: true,
      complaintId,
      message: 'Complaint saved successfully',
    };
  } catch (error) {
    console.error('Error saving complaint:', error);
    throw error;
  }
};

/**
 * Get all complaints (admin view)
 */
export const getAllComplaints = async () => {
  return complaintsData.complaints;
};

/**
 * Get complaint by ID
 */
export const getComplaintById = async (complaintId) => {
  const complaint = complaintsData.complaints.find(c => c.id === complaintId);
  return complaint || null;
};
