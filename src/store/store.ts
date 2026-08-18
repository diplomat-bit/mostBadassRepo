// REPOSITORY SOURCE: diplomat-bit/jamesburvelocallaghaniiiand | PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/src/store/store.ts
================================================================================

```typescript
import { create } from 'zustand';

interface AppState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const useStore = create<AppState>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
}));

export default useStore;
```