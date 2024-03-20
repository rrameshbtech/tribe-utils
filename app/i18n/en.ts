const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  expense: {
    list: {
      spentAt: "{{spentAt}}",
      unknownSpentAt: "unknown",
      totalExpenses: "Total Expenses",
      searchPlaceholder: "Search expenses",
      filter: {
        Day: "Day",
        Week: "Week",
        Month: "Month",
      }
    },
    new: {
      heading: "What's your spend?",
      amount: "Amount",
      payee: "Payee",
      date: "Date",
      spender: "Spender",
      category: "Category",
      location: "Location",
      mode: "Mode",
      save: "Save",
      next: "Next",
      card: {
        modeAndCategoryLabel: "in {{mode}} for {{category}}",
        payeeLabel: "at {{payee}}",
        spenderLabel: "by {{spender}}",
      },
      verbose: "{{spender}} spent {{amount}} for {{category}} in {{payee}} using {{mode}} on {{date}}",
      label: {
        amount: "how much did you spend?",
        payee: "whom did you pay to?",
        date: "when did you spend?",
        category: "for what?",
        mode: "how did you pay?",
        spender: "Who spent?",
        location: "Where did you spend?",
      },
    },
    paymentModes: {
      BankCard: "Bank Card",
      BankTransfer: "Bank Transfer",
    }
  }
}

export default en
export type Translations = typeof en
