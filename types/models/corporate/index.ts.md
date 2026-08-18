// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/corporate/index.ts.md
================================================================================


```typescript
namespace TheLexiconOfTheEnterprise {
    interface IInstrumentOfDelegatedWill {
        readonly holderName: string;
        frozen: boolean;
        readonly controls: any;
    }

    interface IDecreeOfPayment {
        readonly counterpartyName: string;
        readonly amount: number;
        status: "needs_approval" | "approved" | "completed";
    }

    interface IBrokenRhythm {
        readonly description: string;
        readonly severity: "High" | "Low";
        readonly riskScore: number;
    }

    class TheCorporateScribe {
        public static defineTheFormsOfCollectiveAction(): void {
            type CorporateCard = IInstrumentOfDelegatedWill;
            type PaymentOrder = IDecreeOfPayment;
            type FinancialAnomaly = IBrokenRhythm;
        }
    }

    function giveLanguageToTheEnterprise(): void {
        TheCorporateScribe.defineTheFormsOfCollectiveAction();
    }
}
```
