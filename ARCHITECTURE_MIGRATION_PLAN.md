# API Architecture Migration Plan

## From Multi-Layered to Clean Enterprise Architecture

---

## 📋 Executive Summary

This document outlines the migration plan from the current **multi-layered architecture** (ViewModel → Repository → ApiService → apiClient) to a **clean, enterprise-grade architecture** (Service → React Query Hooks → Screens).

**Goal**: Simplify from 4 layers to 2 layers, improve maintainability, and establish consistent patterns across all modules.

---

## 🔍 Current Architecture Analysis

### Current Structure (OLD)

```
📁 Current Architecture
├── src/services/api/
│   ├── ApiClient.ts          ✅ KEEP (axios + interceptors + token refresh)
│   ├── endpoints.ts           ✅ KEEP (but expand for all modules)
│   └── types.ts              ✅ KEEP
│
├── src/services/auth/
│   ├── authApi.ts            ⚠️  REFACTOR (rename to auth.service.ts)
│   ├── AuthRepository.ts     ❌ REMOVE (data transformation layer)
│   └── AuthService.ts        ❌ REMOVE (wrapper around ViewModel)
│
├── src/viewmodels/
│   └── AuthViewModel.ts      ❌ REMOVE (business logic + validation)
│
├── src/hooks/
│   ├── mutations/            ✅ KEEP (but refactor to use new services)
│   │   ├── useSendOtp.ts
│   │   ├── useVerifyOtp.ts
│   │   ├── useResendOtp.ts
│   │   └── useLogout.ts
│   ├── queries/
│   │   └── useCMSData.ts     ⚠️  REFACTOR (use new cms.service.ts)
│   ├── useLogin.ts           ❌ REMOVE (replaced by React Query hooks)
│   └── useOtpVerification.ts ❌ REMOVE (replaced by React Query hooks)
│
├── src/auth/
│   └── AuthContext.tsx       ⚠️  REFACTOR (use React Query hooks instead)
│
└── src/services/strapi/
    └── onboarding/           ⚠️  REFACTOR (move to modules/cms/)
        └── onboardingApi.ts
```

### Current Problems Identified

1. **Too Many Layers**: ViewModel → Repository → ApiService → apiClient (4 layers)
2. **Mixed Responsibilities**:
   - ViewModel: Validation + Business Logic + API calls
   - Repository: Data transformation + Session storage + Test mode
   - ApiService: Pure API calls (good, but wrong location)
3. **Inconsistent Patterns**:
   - Auth uses ViewModel/Repository
   - CMS uses direct axios (not apiClient)
   - Policy/Claims/Profile have no API integration yet
4. **React Query Underutilized**: Hooks exist but screens still use ViewModel/Context
5. **Hard to Scale**: Adding new modules requires creating 3-4 new files

---

## 🎯 Target Architecture (NEW)

### New Structure

```
📁 Target Architecture
├── src/api/
│   ├── apiClient.ts          ✅ (axios + interceptors + token refresh)
│   └── endpoints.ts          ✅ (ALL API endpoints centralized)
│
├── src/modules/
│   ├── auth/
│   │   ├── auth.service.ts   ✅ (Pure API functions)
│   │   ├── auth.validators.ts ✅ (Phone + OTP validation)
│   │   └── auth.hooks.ts     ✅ (React Query hooks)
│   │
│   ├── policy/
│   │   ├── policy.service.ts ✅ (API functions)
│   │   └── policy.hooks.ts   ✅ (React Query hooks)
│   │
│   ├── claims/
│   │   ├── claims.service.ts ✅ (API functions)
│   │   └── claims.hooks.ts   ✅ (React Query hooks)
│   │
│   ├── profile/
│   │   ├── profile.service.ts ✅ (API functions)
│   │   └── profile.hooks.ts   ✅ (React Query hooks)
│   │
│   └── cms/
│       ├── cms.service.ts    ✅ (API functions - migrated from strapi/)
│       └── cms.hooks.ts      ✅ (React Query hooks)
│
├── src/navigation/           ✅ (unchanged)
├── src/screens/             ✅ (pure UI, use hooks only)
└── src/components/          ✅ (pure UI components)
```

### Architecture Rules

1. **Services = Pure API Functions**
   - Only call `apiClient.get/post/put/patch/delete`
   - No validation, no business logic, no storage
   - Return typed responses

2. **Validators = Isolated Validation Logic**
   - Pure functions, no side effects
   - Reusable across services, hooks, and screens

3. **React Query Hooks = Data Fetching & Mutations**
   - Consume services
   - Handle caching, retries, background refresh
   - Return `{ data, isLoading, error, mutate }` pattern

4. **Screens = Pure UI**
   - Use React Query hooks
   - Use validators for form validation
   - No direct API calls, no ViewModel, no Repository

5. **Endpoints Centralized**
   - All API paths in `src/api/endpoints.ts`
   - Consistent naming: `GET_USER`, `CREATE_POLICY`, `UPDATE_CLAIM`

---

## 📝 Migration Steps

### Phase 1: Setup New Structure (Foundation)

#### Step 1.1: Create Module Directories

```bash
mkdir -p src/modules/auth
mkdir -p src/modules/policy
mkdir -p src/modules/claims
mkdir -p src/modules/profile
mkdir -p src/modules/cms
```

#### Step 1.2: Move & Rename apiClient

- ✅ `src/services/api/ApiClient.ts` → `src/api/apiClient.ts`
- ✅ `src/services/api/endpoints.ts` → `src/api/endpoints.ts`
- ✅ `src/services/api/types.ts` → `src/api/types.ts`
- Update all imports across codebase

#### Step 1.3: Expand endpoints.ts

Add all endpoint constants for future modules:

```typescript
// src/api/endpoints.ts
export const AUTH_ENDPOINTS = { ... };
export const POLICY_ENDPOINTS = {
  GET_POLICIES: '/api/v1/policies',
  GET_POLICY: '/api/v1/policies/:id',
  CREATE_POLICY: '/api/v1/policies',
  // ... etc
};
export const CLAIMS_ENDPOINTS = { ... };
export const PROFILE_ENDPOINTS = { ... };
export const CMS_ENDPOINTS = { ... };
```

---

### Phase 2: Migrate Auth Module

#### Step 2.1: Create auth.validators.ts

**Location**: `src/modules/auth/auth.validators.ts`

**Extract from**: `AuthViewModel.validatePhoneNumber()` and `AuthViewModel.validateOtpCode()`

**Content**:

- `validatePhoneNumber(phone: string): PhoneValidationResult`
- `validateOtpCode(code: string): OtpValidationResult`
- `formatPhoneToIdentifier(phone: string): string` (for API calls)

#### Step 2.2: Create auth.service.ts

**Location**: `src/modules/auth/auth.service.ts`

**Migrate from**: `src/services/auth/authApi.ts` (AuthApiService class)

**Functions**:

- `sendOtp(params: SendOtpRequest): Promise<SendOtpResponse>`
- `verifyOtp(params: VerifyOtpRequest): Promise<VerifyOtpResponse>`
- `resendOtp(params: ResendOtpRequest): Promise<ResendOtpResponse>`
- `logout(params: LogoutRequest): Promise<void>`
- `refreshToken(params: RefreshTokenRequest): Promise<RefreshTokenResponse>`

**Changes**:

- Remove all console.logs (or keep minimal)
- Use `formatPhoneToIdentifier` from validators
- Handle session storage in hooks (not service)
- Remove test-mode logic

#### Step 2.3: Create auth.hooks.ts

**Location**: `src/modules/auth/auth.hooks.ts`

**Migrate from**: `src/hooks/mutations/useSendOtp.ts`, `useVerifyOtp.ts`, `useResendOtp.ts`, `useLogout.ts`

**Hooks**:

- `useSendOtp()` - mutation
- `useVerifyOtp()` - mutation (handles session storage on success)
- `useResendOtp()` - mutation
- `useLogout()` - mutation (clears session on success)
- `useGetCurrentSession()` - query (optional, for bootstrapping)

**Session Management**:

- Move session storage logic from `AuthRepository` to hooks
- `useVerifyOtp` saves session on success
- `useLogout` clears session on success

#### Step 2.4: Update AuthContext

**Location**: `src/auth/AuthContext.tsx`

**Changes**:

- Remove dependency on `AuthViewModel` and `AuthService`
- Use React Query hooks from `auth.hooks.ts`
- Keep state management for `status`, `session`, `loading`, `error`
- Dispatch actions based on React Query hook results

**Pattern**:

```typescript
const sendOtpMutation = useSendOtp();
const verifyOtpMutation = useVerifyOtp();

// In requestLogin:
await sendOtpMutation.mutateAsync({ identifier });
dispatch({ type: "LOGIN_SUCCESS" });
```

#### Step 2.5: Update Screens

**Files to Update**:

- `src/screens/login/Login.tsx`
- `src/screens/login/OTPVerification.tsx`

**Changes**:

- Remove `useLogin()` and `useOtpVerification()` hooks
- Use `useSendOtp()`, `useVerifyOtp()`, `useResendOtp()` from `auth.hooks.ts`
- Use validators from `auth.validators.ts` for form validation
- Use `useAuth()` context for state (status, session, error)

#### Step 2.6: Remove Old Files

**Delete**:

- ❌ `src/viewmodels/AuthViewModel.ts`
- ❌ `src/services/auth/AuthRepository.ts`
- ❌ `src/services/auth/AuthService.ts`
- ❌ `src/services/auth/authApi.ts` (migrated to auth.service.ts)
- ❌ `src/hooks/useLogin.ts`
- ❌ `src/hooks/useOtpVerification.ts`
- ❌ `src/viewmodels/index.ts` (if exists)

---

### Phase 3: Migrate CMS Module

#### Step 3.1: Create cms.service.ts

**Location**: `src/modules/cms/cms.service.ts`

**Migrate from**: `src/services/strapi/onboarding/onboardingApi.ts`

**Changes**:

- Replace direct `axios` calls with `apiClient.get()`
- Move to `src/modules/cms/` directory
- Keep data transformation logic (normalizeOnboardingScreens, etc.)
- Export types from same file or separate `cms.types.ts`

**Functions**:

- `getCMSData(params?: GetCMSDataParams): Promise<CMSData>`

#### Step 3.2: Create cms.hooks.ts

**Location**: `src/modules/cms/cms.hooks.ts`

**Migrate from**: `src/hooks/queries/useCMSData.ts`

**Changes**:

- Update import to use `cms.service.ts`
- Keep same React Query configuration

**Hooks**:

- `useCMSData(params?: GetCMSDataParams)`

#### Step 3.3: Update endpoints.ts

Add CMS endpoints:

```typescript
export const CMS_ENDPOINTS = {
  ONBOARDING: "/api/onbordings", // Strapi endpoint
};
```

#### Step 3.4: Update Screens

**Files to Update**:

- `src/screens/login/OnboardingScreen.tsx`
- Any screen using `useCMSData`

**Changes**:

- Update import: `from '../../modules/cms/cms.hooks'`

#### Step 3.5: Remove Old Files

**Delete**:

- ❌ `src/services/strapi/onboarding/onboardingApi.ts`
- ❌ `src/services/strapi/index.ts` (if only re-exports onboarding)
- ❌ `src/services/strapi/types.ts` (move to `cms.types.ts` if needed)

---

### Phase 4: Create Policy Module (New)

#### Step 4.1: Create policy.service.ts

**Location**: `src/modules/policy/policy.service.ts`

**Functions** (when API is ready):

- `getPolicies(): Promise<Policy[]>`
- `getPolicy(id: string): Promise<Policy>`
- `createPolicy(data: CreatePolicyRequest): Promise<Policy>`
- `updatePolicy(id: string, data: UpdatePolicyRequest): Promise<Policy>`

**For Now**: Create placeholder functions that return mock data or throw "Not implemented"

#### Step 4.2: Create policy.hooks.ts

**Location**: `src/modules/policy/policy.hooks.ts`

**Hooks**:

- `usePolicies()` - query
- `usePolicy(id: string)` - query
- `useCreatePolicy()` - mutation
- `useUpdatePolicy()` - mutation

#### Step 4.3: Update endpoints.ts

```typescript
export const POLICY_ENDPOINTS = {
  GET_POLICIES: "/api/v1/policies",
  GET_POLICY: "/api/v1/policies/:id",
  CREATE_POLICY: "/api/v1/policies",
  UPDATE_POLICY: "/api/v1/policies/:id",
};
```

#### Step 4.4: Update Screens

**Files to Update**:

- `src/screens/tabs/Policy.tsx`
- `src/screens/tabs/Home.tsx`
- `src/screens/PolicyDetails.tsx`

**Changes**:

- Replace `MOCK_POLICIES` with `usePolicies()` hook
- Use `usePolicy(id)` in PolicyDetails screen
- Add loading and error states

---

### Phase 5: Create Claims Module (New)

#### Step 5.1: Create claims.service.ts

**Location**: `src/modules/claims/claims.service.ts`

**Functions**:

- `getClaims(): Promise<Claim[]>`
- `getClaim(id: string): Promise<Claim>`
- `createClaim(data: CreateClaimRequest): Promise<Claim>`
- `updateClaim(id: string, data: UpdateClaimRequest): Promise<Claim>`
- `fileLifeClaim(data: LifeClaimRequest): Promise<Claim>`
- `fileTravelClaim(data: TravelClaimRequest): Promise<Claim>`
- `fileVehicleClaim(data: VehicleClaimRequest): Promise<Claim>`
- `fileHealthClaim(data: HealthClaimRequest): Promise<Claim>`
- `fileApartmentClaim(data: ApartmentClaimRequest): Promise<Claim>`
- `fileBusinessClaim(data: BusinessClaimRequest): Promise<Claim>`

#### Step 5.2: Create claims.hooks.ts

**Location**: `src/modules/claims/claims.hooks.ts`

**Hooks**:

- `useClaims()` - query
- `useClaim(id: string)` - query
- `useFileLifeClaim()` - mutation
- `useFileTravelClaim()` - mutation
- `useFileVehicleClaim()` - mutation
- `useFileHealthClaim()` - mutation
- `useFileApartmentClaim()` - mutation
- `useFileBusinessClaim()` - mutation

#### Step 5.3: Update endpoints.ts

```typescript
export const CLAIMS_ENDPOINTS = {
  GET_CLAIMS: "/api/v1/claims",
  GET_CLAIM: "/api/v1/claims/:id",
  CREATE_CLAIM: "/api/v1/claims",
  FILE_LIFE_CLAIM: "/api/v1/claims/life",
  FILE_TRAVEL_CLAIM: "/api/v1/claims/travel",
  FILE_VEHICLE_CLAIM: "/api/v1/claims/vehicle",
  FILE_HEALTH_CLAIM: "/api/v1/claims/health",
  FILE_APARTMENT_CLAIM: "/api/v1/claims/apartment",
  FILE_BUSINESS_CLAIM: "/api/v1/claims/business",
};
```

#### Step 5.4: Update Screens

**Files to Update**:

- `src/screens/tabs/Claims.tsx`
- `src/screens/FiledClaimDetails.tsx`
- `src/screens/ClaimSuccess.tsx`
- All claim process screens:
  - `src/screens/lifeClaimProcess/lifeClaimProcess.tsx`
  - `src/screens/travelClaimProcess/TravelClaimProcess.tsx`
  - `src/screens/vehicleClaimProcess/VehicleClaimProcess.tsx`
  - `src/screens/healthClaimProcess/HealthClaimProcess.tsx`
  - `src/screens/apartmentClaimProcess/ApartmentClaimProcess.tsx`
  - `src/screens/businessClaimProcess/BusinessClaimProcess.tsx`

**Changes**:

- Replace mock data with `useClaims()` hook
- Use mutation hooks for filing claims
- Handle success/error states with React Query

---

### Phase 6: Create Profile Module (New)

#### Step 6.1: Create profile.service.ts

**Location**: `src/modules/profile/profile.service.ts`

**Functions**:

- `getProfile(): Promise<Profile>`
- `updateProfile(data: UpdateProfileRequest): Promise<Profile>`
- `changePassword(data: ChangePasswordRequest): Promise<void>`

#### Step 6.2: Create profile.hooks.ts

**Location**: `src/modules/profile/profile.hooks.ts`

**Hooks**:

- `useProfile()` - query
- `useUpdateProfile()` - mutation
- `useChangePassword()` - mutation

#### Step 6.3: Update endpoints.ts

```typescript
export const PROFILE_ENDPOINTS = {
  GET_PROFILE: "/api/v1/profile",
  UPDATE_PROFILE: "/api/v1/profile",
  CHANGE_PASSWORD: "/api/v1/profile/password",
};
```

#### Step 6.4: Update Screens

**Files to Update**:

- `src/screens/tabs/profile/Profile.tsx`
- `src/screens/tabs/profile/EditProfile.tsx`

**Changes**:

- Use `useProfile()` to fetch user data
- Use `useUpdateProfile()` mutation for saving changes
- Replace hardcoded user data

---

### Phase 7: Cleanup & Finalization

#### Step 7.1: Update All Imports

Search and replace all imports:

- `from '../../services/api'` → `from '../../api'`
- `from '../../services/auth/authApi'` → `from '../../modules/auth/auth.service'`
- `from '../../hooks/mutations/useSendOtp'` → `from '../../modules/auth/auth.hooks'`
- `from '../../viewmodels/AuthViewModel'` → Remove (use validators/hooks instead)

#### Step 7.2: Remove Empty Directories

- `src/services/auth/` (if empty)
- `src/services/strapi/` (if empty)
- `src/viewmodels/` (if empty)
- `src/hooks/mutations/` (if empty)
- `src/hooks/queries/` (if empty)

#### Step 7.3: Update Type Definitions

- Move auth types to `src/modules/auth/auth.types.ts`
- Move policy types to `src/modules/policy/policy.types.ts`
- Move claims types to `src/modules/claims/claims.types.ts`
- Move profile types to `src/modules/profile/profile.types.ts`
- Move CMS types to `src/modules/cms/cms.types.ts`

#### Step 7.4: Update Tests (if any)

- Update test imports
- Mock services instead of ViewModels/Repositories
- Test hooks with React Query test utilities

---

## 📐 Naming Conventions

### Service Functions

- **GET**: `getXYZ()` - e.g., `getPolicies()`, `getProfile()`
- **POST**: `createXYZ()` - e.g., `createClaim()`, `sendOtp()`
- **PUT/PATCH**: `updateXYZ()` - e.g., `updateProfile()`, `updateClaim()`
- **DELETE**: `deleteXYZ()` - e.g., `deletePolicy()`

### React Query Hooks

- **Queries**: `useXYZ()` - e.g., `usePolicies()`, `useProfile()`
- **Mutations**: `useCreateXYZ()`, `useUpdateXYZ()`, `useDeleteXYZ()` - e.g., `useCreateClaim()`, `useUpdateProfile()`
- **Special cases**: `useSendOtp()`, `useVerifyOtp()`, `useFileLifeClaim()`

### Files

- Services: `{module}.service.ts`
- Hooks: `{module}.hooks.ts`
- Validators: `{module}.validators.ts`
- Types: `{module}.types.ts`

---

## 🔄 Migration Order (Recommended)

1. **Phase 1**: Setup new structure (non-breaking)
2. **Phase 2**: Migrate Auth module (most critical)
3. **Phase 3**: Migrate CMS module (simple, good practice)
4. **Phase 4**: Create Policy module (when API ready)
5. **Phase 5**: Create Claims module (when API ready)
6. **Phase 6**: Create Profile module (when API ready)
7. **Phase 7**: Cleanup & finalization

---

## ⚠️ Breaking Changes & Migration Notes

### Breaking Changes

1. **Import paths change**: All service/hook imports need updating
2. **AuthContext API**: May need minor adjustments if screens depend on specific methods
3. **Session storage**: Moved from Repository to hooks (transparent to screens)

### Backward Compatibility

- Keep old files during migration, mark as deprecated
- Update imports gradually
- Test each phase before moving to next

### Testing Strategy

1. Test Auth flow end-to-end after Phase 2
2. Test CMS data loading after Phase 3
3. Test each new module as it's created
4. Full regression test after Phase 7

---

## 📊 Benefits After Migration

1. **Reduced Complexity**: 4 layers → 2 layers
2. **Consistency**: All modules follow same pattern
3. **Reusability**: Services can be used in web, mobile, admin
4. **Testability**: Pure functions easier to test
5. **Scalability**: Adding new modules is straightforward
6. **Developer Experience**: Clear structure, easy onboarding
7. **React Query Benefits**: Automatic caching, retries, background refresh

---

## 🎯 Success Criteria

- [ ] All ViewModels removed
- [ ] All Repositories removed
- [ ] All modules follow same structure
- [ ] All screens use React Query hooks
- [ ] All endpoints centralized in `endpoints.ts`
- [ ] No direct API calls in screens/components
- [ ] All imports updated
- [ ] All tests passing
- [ ] No console errors
- [ ] App functionality unchanged (regression test)

---

## 📚 Example Code Structure

### Example: auth.service.ts

```typescript
import { apiClient } from '../../api/apiClient';
import { AUTH_ENDPOINTS } from '../../api/endpoints';
import { formatPhoneToIdentifier } from './auth.validators';
import type { SendOtpRequest, SendOtpResponse, ... } from './auth.types';

export const authService = {
  async sendOtp(phone: string): Promise<SendOtpResponse> {
    const identifier = formatPhoneToIdentifier(phone);
    const response = await apiClient.post<SendOtpResponse>(
      AUTH_ENDPOINTS.SEND_OTP,
      { identifier },
      { skipAuth: true }
    );
    return response.data;
  },
  // ... other functions
};
```

### Example: auth.hooks.ts

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth.service";
import { saveSession, clearSession } from "./auth.storage";

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => authService.sendOtp(phone),
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authService.verifyOtp(phone, otp),
    onSuccess: async (session) => {
      await saveSession(session);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
```

### Example: Screen Usage

```typescript
import { useSendOtp, useVerifyOtp } from "../../modules/auth/auth.hooks";
import { validatePhoneNumber } from "../../modules/auth/auth.validators";

function LoginScreen() {
  const sendOtpMutation = useSendOtp();
  const { validatePhoneNumber } = useAuth();

  const handleLogin = async () => {
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    try {
      await sendOtpMutation.mutateAsync(phoneNumber);
      navigateToOTP(phoneNumber);
    } catch (error) {
      setError(error.message);
    }
  };
}
```

---

## 🚀 Next Steps

1. **Review this plan** with the team
2. **Create feature branch**: `refactor/api-architecture-migration`
3. **Start with Phase 1** (setup, non-breaking)
4. **Test thoroughly** after each phase
5. **Merge incrementally** or as one PR (team decision)

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Author**: Architecture Migration Plan
