export const STATUS = {
    PR: {
        OPEN: 1,
        SUBMITTED: 2,
        APPROVED: 3,
        IN_PROGRESS_PC: 4,
        PENDING_PM: 5,
        COMPLETED: 6,
        REJECTED: 7,
        CANCELED: 8
    },
    PC: {
        OPEN: 9,
        SUBMITTED: 10,
        APPROVED: 11,
        IN_PROGRESS_PM: 12,
        COMPLETED: 13,
        REJECTED: 14,
        CANCELED: 15
    },
    CA: { // Cash Advance
        OPEN: 16,
        SUBMITTED: 17,
        APPROVED: 18,
        COMPLETED: 19,
        REJECTED: 20,
        CANCELED: 21
    },
    PO: {
        PENDING_PM: 22,
        IN_PROGRESS_PM: 23,
        COMPLETED: 24,
        REJECTED: 25,
        CANCELED: 26
    },
    PM: { // Payment
        PAID: 27,
        PARTIALLY_PAID: 28,
        CANCELED: 29
    },
    PTC: { // Petty Cash
        OPEN: 30,
        SUBMITTED: 31,
        APPROVED: 32,
        REJECTED: 36,
        CANCELED: 37
    }
};

