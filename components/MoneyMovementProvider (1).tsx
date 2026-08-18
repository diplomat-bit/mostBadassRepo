// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/components/MoneyMovementProvider (1)_1.tsx
================================================================================


export * from './MoneyMovementContext';
export interface Payee { payeeId: string; payeeName: string; payeeNickname: string; paymentType: string; displayAccountNumber: string; }
export interface PayeeListResponse { payeeList: Payee[] }
export interface PayeeDetailsResponse { internalDomesticPayee?: any }
      