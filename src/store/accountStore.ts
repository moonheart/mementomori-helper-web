import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AccountDto } from '../api/generated';

interface AccountState {
    accounts: AccountDto[];
    currentAccountId: number | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setAccounts: (accounts: AccountDto[]) => void;
    addAccount: (account: AccountDto) => void;
    removeAccount: (userId: number) => void;
    setCurrentAccount: (userId: number | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useAccountStore = create<AccountState>()(
    persist(
        (set) => ({
            accounts: [],
            currentAccountId: null,
            isLoading: false,
            error: null,

            setAccounts: (accounts) => set({ accounts }),

            addAccount: (account) =>
                set((state) => ({
                    accounts: [...state.accounts, account],
                })),

            removeAccount: (userId) =>
                set((state) => ({
                    accounts: state.accounts.filter((a) => a.userId !== userId),
                    currentAccountId:
                        state.currentAccountId === userId ? null : state.currentAccountId,
                })),

            setCurrentAccount: (userId) => set({ currentAccountId: userId }),

            setLoading: (loading) => set({ isLoading: loading }),

            setError: (error) => set({ error }),

            clearError: () => set({ error: null }),
        }),
        {
            name: 'account-storage',
            partialize: (state) => ({
                accounts: state.accounts,
                currentAccountId: state.currentAccountId,
            }),
        }
    )
);
