# QA Issues - Code Fix Guide

## Issue #5: CRITICAL - Duplicate Auth Session Requests
**Status:** Needs Investigation & Fix  
**Impact:** Performance, API load  
**Severity:** CRITICAL

### Symptoms
- Each admin page load triggers 2 identical `GET /api/auth/session` requests
- Observed in Network tab: ReqID 328 & 330 on same page load

### Root Cause Analysis
Likely caused by:
1. Multiple `useSession()` hooks in component tree
2. Missing request deduplication in NextAuth middleware
3. Session provider wrapping multiple consuming components

### Where to Check
- `app/(admin)/layout.tsx` - Look for auth checks
- `middleware.ts` - Check NextAuth middleware
- Components using `useSession()` - May be duplicated
- `app/api/auth/[...nextauth]/route.ts` - NextAuth config

### Fix Steps
1. Search codebase for `useSession()` calls:
   ```bash
   grep -r "useSession()" app/ components/
   ```
2. Consolidate session checks to single point (layout level)
3. Implement request deduplication:
   ```typescript
   // Add to NextAuth config
   session: {
     strategy: "jwt", // or adjust as needed
   }
   ```
4. Test: Reload `/admin/products` and verify only 1 auth session request

### Test Result After Fix
- Before: 2 requests per page
- After: 1 request per page (or cached)

---

## Issue #4: HIGH - Form Accessibility (Lighthouse 88/100)
**Status:** Needs Investigation & Fix  
**Impact:** Accessibility compliance  
**Severity:** HIGH

### Symptoms
- Lighthouse reports 3 failed accessibility audits on `/admin/products/new`
- Screen reader issues likely on form fields
- Keyboard navigation may not work properly

### Root Cause Analysis
Missing ARIA attributes and label associations:
- Form labels not connected to inputs via `htmlFor`
- Combobox elements missing ARIA roles
- Possibly missing ARIA-label on icon buttons

### Where to Check
- `app/(admin)/products/new/page.tsx` - Main form page
- `components/` - Look for form component files
- Combobox/select components - May lack proper ARIA

### Fix Steps
1. For each input field, ensure:
   ```typescript
   // ❌ Bad
   <label>Product Name *</label>
   <input type="text" />
   
   // ✅ Good
   <label htmlFor="product-name">Product Name *</label>
   <input id="product-name" type="text" />
   ```

2. For combobox/select elements:
   ```typescript
   // Add ARIA attributes
   <select
     id="category"
     aria-label="Product Category"
     aria-required="true"
   >
     {/* options */}
   </select>
   ```

3. For icon buttons, add aria-label:
   ```typescript
   <button aria-label="Add new product">
     <PlusIcon />
   </button>
   ```

### Test After Fix
```bash
npm run build
npm run start
# Navigate to /admin/products/new
# Run Lighthouse audit - should see 94+ on accessibility
```

---

## Issue #1: MEDIUM - Missing Autocomplete Attribute
**Status:** Needs Fix  
**Page:** `/admin/products/new`  
**Severity:** MEDIUM

### Symptoms
- DevTools Console shows: "An element doesn't have an autocomplete attribute"
- One form input missing autocomplete

### Root Cause
Single form field in product creation form lacks `autocomplete` attribute

### Where to Check
- `app/(admin)/products/new/page.tsx`
- Look for `<input>` without autocomplete attribute
- Likely one of: name, description, or SKU fields

### Fix
Add `autocomplete` to input:
```typescript
// ❌ Before
<input type="text" placeholder="Product Name" />

// ✅ After
<input 
  type="text" 
  placeholder="Product Name"
  autoComplete="off"  // or "on" for autocomplete
/>
```

### Note on Values
- Use `"off"` if you don't want browser suggestions
- Use `"on"` for standard autocomplete
- Use specific values like `"email"`, `"name"`, `"tel"` for specific fields

---

## Issue #2: MEDIUM - Missing Form Field ID/Name
**Status:** Needs Fix  
**Page:** `/admin/pages`  
**Severity:** MEDIUM

### Symptoms
- DevTools Console shows: "A form field element should have an id or name attribute"
- Search input field lacks these attributes

### Location
`app/(admin)/pages/page.tsx` - Search field near table

### Fix
```typescript
// ❌ Before
<input type="search" placeholder="Search by title or slug..." />

// ✅ After
<input 
  type="search" 
  id="page-search"
  name="page-search"
  placeholder="Search by title or slug..." 
/>
```

### Verification
- After fix, console warning should disappear
- Search functionality should continue working

---

## Issue #3: MEDIUM - Multiple Missing Form Field Attributes
**Status:** Needs Fix  
**Page:** `/admin/media`  
**Severity:** MEDIUM

### Symptoms
- DevTools Console shows: "A form field element should have an id or name attribute (count: 2)"
- 2 form fields (search + filter) are missing attributes

### Location
`app/(admin)/media/page.tsx` - Media library header controls

### Fields Affected
1. Search input: "Search by name..."
2. Type filter: "All / Images / Documents" toggle or dropdown

### Fix
```typescript
// ❌ Before
<input type="search" placeholder="Search by name..." />
<select>
  <option>All</option>
  <option>Images</option>
  <option>Documents</option>
</select>

// ✅ After
<input 
  type="search"
  id="media-search"
  name="media-search"
  placeholder="Search by name..." 
/>
<select
  id="media-type-filter"
  name="media-type"
>
  <option>All</option>
  <option>Images</option>
  <option>Documents</option>
</select>
```

### Verification
- Console warnings should be gone
- Both fields should function normally

---

## Quick Fix Checklist

### Priority 1: CRITICAL
- [ ] Issue #5 - Implement auth deduplication
  - Time: 1-2 hours
  - Complexity: Medium
  - Search for: `useSession`, `NextAuth config`

### Priority 2: HIGH
- [ ] Issue #4 - Add ARIA labels to forms
  - Time: 1-2 hours
  - Complexity: Low
  - Search for: Form labels, inputs, comboboxes

### Priority 3: MEDIUM
- [ ] Issue #1 - Add autocomplete attribute
  - Time: 5 mins
  - Complexity: Very Low
  - Search for: `/admin/products/new` form inputs

- [ ] Issue #2 - Add ID/name to pages search
  - Time: 5 mins
  - Complexity: Very Low
  - Search for: `/admin/pages` search input

- [ ] Issue #3 - Add ID/name to media fields
  - Time: 10 mins
  - Complexity: Very Low
  - Search for: `/admin/media` search + filter

---

## Testing Commands

### Run Full Build & Start
```bash
npm run build
npm run start
```

### Check for Console Errors
Open Chrome DevTools → Console tab, visit each page and check for:
- "An element doesn't have an autocomplete attribute"
- "A form field element should have an id or name attribute"

### Run Lighthouse
1. Open DevTools → Lighthouse tab
2. Run audit on:
   - `http://localhost:3000/` (target: 94+)
   - `http://localhost:3000/admin/products/new` (target: 95+)

### Check Auth Requests
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Reload `/admin/products` page
4. Count `/api/auth/session` requests (should be 1, not 2)

---

## Summary

| Issue | Type | Fix Time | Complexity | Priority |
|-------|------|----------|-----------|----------|
| #5 | Duplicate Requests | 1-2h | Medium | CRITICAL |
| #4 | ARIA Labels | 1-2h | Low | HIGH |
| #1 | Autocomplete | 5min | Very Low | MEDIUM |
| #2 | Form ID/Name | 5min | Very Low | MEDIUM |
| #3 | Form ID/Name | 10min | Very Low | MEDIUM |

**Total Fix Time: ~3-4 hours**

---

## Validation After Fixes

After applying all fixes:
1. ✅ Zero console warnings on all pages
2. ✅ Lighthouse score 95+ on all pages
3. ✅ Single auth session request per admin page
4. ✅ All form fields have id/name attributes
5. ✅ Keyboard navigation works on all forms
6. ✅ Screen reader can identify all form labels

---

End of Fix Guide
