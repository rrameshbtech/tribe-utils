const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    yes: "Yes",
    no: "No",
    delete: "Delete",
    edit: "Edit",
    notSelected: "Not selected",
    getStarted: "Get started",
    save: "Save",
  },
  homeScreen: {
    title: "Tribe",
    subtitle: "Connect. Track. Secure",
    expenses: "Expenses",
    settings: "Settings",
  },
  welcomeScreen: {
    postscript: "Follow simple steps to get started.",
    welcomeTitle: "Welcome to the Tribe!",
    privateSpace: "No crap! Just a secure space for tracking your chores",
  },
  settingsScreen: {
    title: "Setup your Tribe",
    authUser: {
      title: "Your details",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "Your email",
      emailHelper: "We'll use email for unique identification only.",
    },
    finishSetup: "Save & Continue",
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
    noExpenses: {
      heading: "Oops! No expenses found",
      content:
        "Forgot to add an expense? Press (+) button to add it.",
      button: "Add an expense",
    },
  },
  expense: {
    tabs: {
      expenses: "Expenses",
      settings: "Settings",
      report: "Report",
    },
    settings: {
      title: "Expense Settings",
      location: "Capture location",
      defaultPaymentMode: "Payment mode",
      defaultCategory: "Category",
      defaultPayee: "Payee",
      defaultSpender: "Spender",
      defaultValueSectionTitle: "Expense default choices",
      locationPermissionTitle: "Location permission",
      locationPermissionMessage: "We need your location to show you the nearest expenses",
      locationPermissionButtonNeutral: "Ask me later",
      locationPermissionButtonNegative: "No",
      locationPermissionButtonPositive: "Yes",
      locationPermissionDeniedTitle: "Location permission denied",
      locationPermissionDeniedMessage:
        "Please enable location access in your app settings to capture expense location",
      spenderSelectionTitle: "Who spends often?",
      payeeSelectionTitle: "Where do you spend often?",
      categorySelectionTitle: "What do you spend for often?",
      paymentModeSelectionTitle: "How do you pay oftem?",
    },
    list: {
      spentAt: "{{spentAt}}",
      unknownSpentAt: "unknown",
      totalExpenses: "Total Expenses",
      searchPlaceholder: {
        Day: "Today's expenses",
        Week: "Current week's expenses",
        Month: "Current month's expenses",
      },
      filter: {
        Day: "Day",
        Week: "Week",
        Month: "Month",
      },
    },
    delete: {
      confirmTitle: "Delete?",
      confirmMessage: "Are you sure you want to delete this expense for {{category}} in {{payee}}?",
      successTitle: "Deleted",
      successMessage: "Expense deleted successfully",
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
      verbose:
        "{{spender}} spent {{amount}} for {{category}} in {{payee}} using {{mode}} on {{date}}",
      label: {
        amount: "how much did you spend?",
        payee: "whom did you pay to?",
        date: "when did you spend?",
        category: "for what?",
        mode: "how did you pay?",
        spender: "Who spent?",
        location: "Where did you spend?",
      },
      error: {
        title: "Oops! Forgot something?",
        amountZero: "Expense amount cannot be 0",
        forgotToSave: "You didn't save. Are you sure to cancel?",
      },
      savedMessage: "Expense saved successfully",
    },
    report: {
      title: "Report of {{month}}",
      subtitle: "Choose your report format",
      summaryLargestExpenseText: "{{amount}} for {{category}} in {{payee}}",
      expenseByDate: "Expenses per day",
      expenseByCategory: "Expenses per category",
      expenseByPayee: "Expenses per payee",
      expenseByPaymentMode: "Expenses per payment mode",
      summary: "Summary",
      selectMonthTitle: "Which month do you want to analyse?",
    },
    paymentModes: {
      BankCard: "Bank Card",
      BankTransfer: "Bank Transfer",
    },
    categories: {
      "Healthcare": "Health care",
      "PersonalCare": "Personal care",
    }
  },
}

export default en
export type Translations = typeof en
