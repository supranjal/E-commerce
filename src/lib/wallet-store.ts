import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WalletTransactionType =
  | "ADD_FUNDS"
  | "P2P_SENT"
  | "P2P_RECEIVED"
  | "CHECKOUT_PAYMENT";

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  counterparty?: string;
  note?: string;
  createdAt: string;
}

interface WalletStore {
  walletId: string;
  balance: number;
  transactions: WalletTransaction[];
  addFunds: (amount: number, note?: string) => { success: boolean; message?: string };
  sendP2P: (
    recipientWalletId: string,
    amount: number,
    note?: string
  ) => { success: boolean; message: string };
  mockReceiveP2P: (
    senderWalletId: string,
    amount: number,
    note?: string
  ) => { success: boolean; message?: string };
}

function makeRef(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      walletId: `RKW-${Math.floor(100000 + Math.random() * 900000)}`,
      balance: 0,
      transactions: [],

      addFunds: (amount, note) => {
        const normalized = Number(amount);
        if (!Number.isFinite(normalized) || normalized <= 0) {
          return { success: false, message: "Enter a valid top-up amount." };
        }

        set((state) => ({
          balance: state.balance + normalized,
          transactions: [
            {
              id: makeRef("WALLET"),
              type: "ADD_FUNDS",
              amount: normalized,
              note,
              createdAt: new Date().toISOString(),
            },
            ...state.transactions,
          ],
        }));

        return { success: true };
      },

      sendP2P: (recipientWalletId, amount, note) => {
        const normalized = Number(amount);
        if (!recipientWalletId.trim()) {
          return { success: false, message: "Recipient wallet ID is required." };
        }
        if (!Number.isFinite(normalized) || normalized <= 0) {
          return { success: false, message: "Transfer amount must be greater than 0." };
        }

        const { balance, walletId } = get();
        if (recipientWalletId.trim().toUpperCase() === walletId.toUpperCase()) {
          return { success: false, message: "You cannot transfer to your own wallet." };
        }

        if (normalized > balance) {
          return { success: false, message: "Insufficient wallet balance." };
        }

        set((state) => ({
          balance: state.balance - normalized,
          transactions: [
            {
              id: makeRef("P2P"),
              type: "P2P_SENT",
              amount: normalized,
              counterparty: recipientWalletId.trim().toUpperCase(),
              note,
              createdAt: new Date().toISOString(),
            },
            ...state.transactions,
          ],
        }));

        return {
          success: true,
          message: `Transfer successful to ${recipientWalletId.trim().toUpperCase()}.`,
        };
      },

      mockReceiveP2P: (senderWalletId, amount, note) => {
        const normalized = Number(amount);
        if (!Number.isFinite(normalized) || normalized <= 0) {
          return { success: false, message: "Invalid receive amount." };
        }

        set((state) => ({
          balance: state.balance + normalized,
          transactions: [
            {
              id: makeRef("P2P"),
              type: "P2P_RECEIVED",
              amount: normalized,
              counterparty: senderWalletId.trim().toUpperCase() || "RKW-SENDER",
              note,
              createdAt: new Date().toISOString(),
            },
            ...state.transactions,
          ],
        }));

        return { success: true };
      },
    }),
    {
      name: "rudrakart-wallet-storage",
    }
  )
);
