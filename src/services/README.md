# Switching from Mock to Real Backend

1. Set `VITE_USE_MOCK=false` in your `.env`
2. Set `VITE_API_URL` to your backend base URL
3. Ensure your backend returns data in the response envelope `{ success, data, meta }`
4. Ensure `POST /auth/login` returns `{ token: '...' }` — store as `nexacare_token`
5. Done. No component code changes required.

## Per-service partial migration

Override per-service if you want to migrate one feature at a time:

```js
const USE_PATIENTS_MOCK = false;
export const patientService = USE_PATIENTS_MOCK ? mock : api;
```
