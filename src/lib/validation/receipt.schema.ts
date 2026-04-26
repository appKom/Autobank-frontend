export const receiptSchema = (usedOnlineCard: boolean) =>
  ({
    amount: {
      required: true,
      pattern: /^\d+([.,]\d+)?$/,
      messages: {
        required: 'Beløp mangler',
        pattern: 'Ugyldig beløp',
      },
    },

    account_number: {
      required: !usedOnlineCard,
      pattern: /^\d{11}$/,
      messages: {
        required: 'Kontonummer mangler',
        pattern: 'Kontonummer må være 11 sifre',
      },
    },

    card_used: {
      required: usedOnlineCard,
      messages: {
        required: 'Velg kort benyttet',
      },
    },

    name: {
      required: true,
      messages: {
        required: 'Vennligst skriv anledning',
      },
    },

    committee_id: {
      required: true,
      messages: {
        required: 'Velg en ansvarlig enhet',
      },
    },

    description: {
      required: false,
      messages: {},
    },

    attachments: {
      required: true,
      messages: {
        required: 'Last opp minst én kvittering/vedlegg',
      },
    },
  }) as const;

type Schema = ReturnType<typeof receiptSchema>;
type FieldKey = keyof Schema;

export function getReceiptFieldValidation(schema: Schema, field: FieldKey) {
  const config = schema[field];
  const rules: any = {};

  // required
  if (config.required) {
    rules.required = config.messages.required;
  }

  // pattern
  if ('pattern' in config && config.pattern) {
    rules.validate = (value: any) => {
      if (!value && !config.required) return true;

      const ok = config.pattern.test(value || '');
      return ok || config.messages.pattern;
    };
  }

  return rules;
}
