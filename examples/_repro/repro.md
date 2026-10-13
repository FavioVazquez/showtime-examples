### Repro: signs in and greets the user (FAILED)

`login.spec.js:6` · chromium · Playwright 1.63.0

<!-- drag repro.mp4 onto this line: GitHub uploads it and puts the video player here -->

**Steps**

1. Open app/index.html (`login.spec.js:7`)
2. Type 16 characters into the 'Email' field (`login.spec.js:8`)
3. Type 16 characters into the 'Password' field (`login.spec.js:9`)
4. Type 17 characters into the 'API token' field (`login.spec.js:10`)
5. Click the 'Sign in' button (`login.spec.js:11`)
6. **FAILED:** Expect the level-1 heading to have text “Welcome, Ada!” (`login.spec.js:12`)

**Failure**

```
expect(locator).toHaveText(expected) failed
Expected: "Welcome, Ada!"
Received: "Welcome back, Ada"
Timeout: 1500ms
Last log: unexpected value "Welcome back, Ada"
```

At `login.spec.js:12`:

```
await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome, Ada!', { timeout: 1500 });
```

**Console errors**

- Failed to load avatar for Ada: 404

**Re-run**

```
npx playwright test login.spec.js:6
npx playwright show-trace trace.zip
```

<sub>Made with `showtime repro`: typed values are never shown; paths, query strings, secret-looking text, e-mail addresses and --redact matches are masked. Screenshots are shown as they were captured (typed fields covered); --redact does not touch pixels.</sub>
