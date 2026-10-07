'use client';

import { SectionTile } from '@/app/components/section-tile/SectionTile';
import styles from './DateFilterSection.module.css';

interface DateFilterSectionProps {
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

export function DateFilterSection({ dateRange, onDateRangeChange }: DateFilterSectionProps) {
  const [startDate, endDate] = dateRange;

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateRangeChange(date, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateRangeChange(startDate, date);
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <SectionTile title="Filtrer par date">
      <div className={styles.container}>
        <p className={styles.description}>
          (Optionnel) Sélectionnez une plage de dates pour filtrer les réponses. Seuls les
          étudiants dont la date de réponse chevauche cette plage seront inclus.
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="start-date" className={styles.label}>
            Date de début :
          </label>
          <input
            id="start-date"
            type="date"
            value={formatDateForInput(startDate)}
            onChange={handleStartDateChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="end-date" className={styles.label}>
            Date de fin :
          </label>
          <input
            id="end-date"
            type="date"
            value={formatDateForInput(endDate)}
            onChange={handleEndDateChange}
            className={styles.input}
          />
        </div>
      </div>
    </SectionTile>
  );
}
