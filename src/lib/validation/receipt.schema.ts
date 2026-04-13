import { z } from 'zod';

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const receiptSchema = (usedOnlineCard: boolean) =>
  z.object({
    amount: z.string().min(1, 'Beløp mangler'),

    account_number: z
      .string()
      .optional()
      .refine((val) => {
        if (usedOnlineCard) return true;
        return /^\d{11}$/.test(val || '');
      }, 'Kontonummer må være 11 sifre'),

    card_used: z
      .string()
      .optional()
      .refine(() => {
        if (!usedOnlineCard) return true;
        return true;
      })
      .refine((val) => {
        if (!usedOnlineCard) return true;
        return !!val;
      }, 'Velg kort benyttet'),

    name: z.string().min(1, 'Vennligst skriv anledning'),

    committee_id: z.string().min(1, 'Velg en ansvarlig enhet'),

    description: z.string().optional(),

    attachments: z.array(z.any()).min(1, 'Last opp minst én kvittering/vedlegg'),
  });
