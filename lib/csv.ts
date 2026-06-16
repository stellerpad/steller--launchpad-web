import { AirdropRecipient } from '@/types';

export function parseCSV(csvContent: string): AirdropRecipient[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
  
  const addressIndex = headers.findIndex(h => h.includes('address'));
  const amountIndex = headers.findIndex(h => h.includes('amount'));
  
  if (addressIndex === -1 || amountIndex === -1) {
    throw new Error('CSV must contain "address" and "amount" columns');
  }
  
  const recipients: AirdropRecipient[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length >= Math.max(addressIndex, amountIndex) + 1) {
      const address = values[addressIndex];
      const amount = values[amountIndex];
      
      if (address && amount && !isNaN(Number(amount))) {
        recipients.push({ address, amount });
      }
    }
  }
  
  return recipients;
}

export function validateCSVFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      reject(new Error('Please upload a CSV file'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function generateSampleCSV(): string {
  return `address,amount
GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX,1000
GYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY,2000
GZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ,500`;
}