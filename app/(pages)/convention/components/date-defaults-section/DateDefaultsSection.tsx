'use client';

import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import sharedStyles from '../../../../shared.module.css';
import styles from './DateDefaultsSection.module.css';
import { SectionTile } from '@/app/components/section-tile/SectionTile';

// Enregistrer la locale française
registerLocale('fr', fr);

interface DateDefaultsSectionProps {
  defaultStartDate: string;
  defaultEndDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateDefaultsSection({
  defaultStartDate,
  defaultEndDate,
  onStartDateChange,
  onEndDateChange,
}: DateDefaultsSectionProps) {
  // Calculer les dates par défaut pour l'ouverture des calendriers
  const getNextMarch = () => {
    const now = new Date();
    const year = now.getMonth() >= 2 ? now.getFullYear() + 1 : now.getFullYear();
    return new Date(year, 2, 1); // Mars = mois 2 (0-indexed)
  };

  const getNextMay = () => {
    const now = new Date();
    const year = now.getMonth() >= 4 ? now.getFullYear() + 1 : now.getFullYear();
    return new Date(year, 4, 1); // Mai = mois 4 (0-indexed)
  };

  const [startDate, setStartDate] = useState<Date | null>(
    defaultStartDate ? new Date(defaultStartDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    defaultEndDate ? new Date(defaultEndDate) : null
  );

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      onStartDateChange(date.toISOString().split('T')[0]);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (date) {
      onEndDateChange(date.toISOString().split('T')[0]);
    }
  };

  return (
    <SectionTile title="4. Dates par défaut">
      <p className={sharedStyles.description}>
        Ces dates seront utilisées lorsque les dates ne sont pas spécifiées dans le fichier Excel.
      </p>

      <div className={styles.datePickersContainer}>
        <div className={styles.datePickerWrapper}>
          <label className={sharedStyles.label}>
            Date de début par défaut
          </label>
          <div className={styles.datePickerContainer}>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="dd MMMM yyyy"
              locale="fr"
              inline
              openToDate={startDate || getNextMarch()}
            />
          </div>
        </div>

        <div className={styles.datePickerWrapper}>
          <label className={sharedStyles.label}>
            Date de fin par défaut
          </label>
          <div className={styles.datePickerContainer}>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="dd MMMM yyyy"
              locale="fr"
              inline
              openToDate={endDate || getNextMay()}
            />
          </div>
        </div>
      </div>
    </SectionTile>
  );
}
