// src/components/DeliverablesView.tsx
import { useState } from 'react';
import { Company } from '../data';
import { ReportsDeliveryCenter } from './ReportsDeliveryCenter';
import { ReportGenerator } from './ReportGenerator';
import { WeeklyReportView } from './WeeklyReportView';
import { MonthlyReportView } from './MonthlyReportView';
import { QuarterlyReportView } from './QuarterlyReportView';

export function DeliverablesView({
  company
}: {
  company: Company;
}) {
  // Navigation sub-page state: 'center' | 'generator' | 'weekly' | 'monthly' | 'quarterly'
  const [subPage, setSubPage] = useState<'center' | 'generator' | 'weekly' | 'monthly' | 'quarterly'>('center');

  return (
    <div className="w-full animate-fade-in">
      {subPage === 'center' && (
        <ReportsDeliveryCenter onNavigate={(page) => setSubPage(page as any)} />
      )}
      
      {subPage === 'generator' && (
        <ReportGenerator onComplete={() => setSubPage('center')} />
      )}
      
      {subPage === 'weekly' && (
        <WeeklyReportView selectedCompany={company} onBack={() => setSubPage('center')} />
      )}
      
      {subPage === 'monthly' && (
        <MonthlyReportView onBack={() => setSubPage('center')} />
      )}
      
      {subPage === 'quarterly' && (
        <QuarterlyReportView onBack={() => setSubPage('center')} />
      )}
    </div>
  );
}
