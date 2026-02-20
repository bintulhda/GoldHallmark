import fs from 'fs';
import path from 'path';

const dataPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '..',
  'data',
  'huidDatabase.json',
);

let huidData = {};

try {
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  huidData = JSON.parse(fileContents);
} catch (err) {
  console.warn('Could not load HUID database JSON, using empty dataset.', err);
}

const normalizeHuid = (huid) => huid.toUpperCase().trim();

const isValidFormat = (huid) => /^[A-Z0-9]{6,10}$/.test(huid);

/**
 * Verify HUID against mock database.
 */
export const verifyHuid = async (rawHuid) => {
  const huid = normalizeHuid(rawHuid);

  if (!isValidFormat(huid)) {
    return {
      success: false,
      validFormat: false,
      message: 'Invalid HUID format. Use 6-10 alphanumeric characters.',
    };
  }

  const record = huidData[huid];

  if (!record) {
    return {
      success: false,
      validFormat: true,
      message: 'HUID not found in registry. Please verify with jeweller or BIS.',
    };
  }

  return {
    success: true,
    validFormat: true,
    message: 'HUID verified successfully.',
    huid,
    goldPurity: record.goldPurity,
    certificationStatus: record.certificationStatus,
    jewelerName: record.jewelerName,
    location: record.location,
    lastVerifiedAt: record.lastVerifiedAt,
  };
};

