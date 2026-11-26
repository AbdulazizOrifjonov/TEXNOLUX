const fs = require('fs');
const path = require('path');
const { createClient } = require('../frontend/node_modules/@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Set SUPABASE_URL and SUPABASE_KEY.');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MOCK_DATA_PATH = path.resolve(__dirname, '../frontend/src/services/mockData.js');

async function wipe() {
  console.log('1. Clearing mockData.js defaultProducts to empty array []...');
  let content = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
  const pStart = content.indexOf('export const defaultProducts = [');
  const bStart = content.indexOf('export const defaultBanners = [');
  if (pStart === -1 || bStart === -1) {
    console.error('Cannot locate defaultProducts in mockData.js');
    return;
  }

  const updatedContent = content.slice(0, pStart + 'export const defaultProducts = '.length) +
    '[];\n\n' + content.slice(bStart);

  fs.writeFileSync(MOCK_DATA_PATH, updatedContent, 'utf8');
  console.log('mockData.js is now empty []!');

  console.log('2. Wiping all products from Supabase cloud database...');
  try {
    const { error } = await supabase.from('products').delete().neq('id', '___safe_keep___');
    if (error) {
      console.error('Supabase delete error:', error.message);
    } else {
      console.log('Successfully wiped all products from Supabase cloud!');
    }
  } catch (e) {
    console.error('Supabase exception:', e.message);
  }
}

wipe();
