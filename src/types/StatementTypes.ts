// REPOSITORY SOURCE: diplomat-bit/my-appaibanking | PATH: diplomat-bit-my-appaibanking-43962ef/src/types/StatementTypes.ts
================================================================================


export interface StatementLine {
    BookgDt: string;
    ValDt: string;
    Amt: number;
    CdtDbtInd: 'CRDT' | 'DBIT';
    Sts: { Cd: string };
    BkTxCd: { Prtry: { Domn: string; Fmly: string; SubFmly: string } };
    Purp: { Cd: string };
    RmtInf: { Ustrd: string };
    NtryRef: string;
    AddtlNtryInf: string;
    value?: { Ccy: string; Value: number };
}
      