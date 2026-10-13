# showtime repro: the film's script

Every line the film will show or speak, from the trace, after the filters. Edit the text after a label, or
delete a line to leave it out, then run the same command again with --yes (or: showtime repro --yes <job>).
Every line goes through the filters again then. Filters can miss things: read every line before you render.
Screenshots are shown as captured (fields a value was typed into are covered); --redact does not touch
pixels. Watch the film before you post it.


## title

# also shown: FAILED, Playwright 1.63.0 · chromium · 6 steps · fails at step 6
show test.title: signs in and greets the user
show test.location: login.spec.js:6
say title: Signs in and greets the user. This test fails at step 6.

## step 1

show step1.caption: Open app/index.html
show step1.url: app/index.html
show step1.where: login.spec.js:7
say step1: Open the page.

## step 2

show step2.caption: Type 16 characters into the 'Email' field
show step2.locator: getByLabel('Email')
show step2.url: app/index.html
show step2.where: login.spec.js:8
say step2: Type into the Email field.

## step 3

show step3.caption: Type 16 characters into the 'Password' field
show step3.locator: getByLabel('Password')
show step3.url: app/index.html
show step3.where: login.spec.js:9
say step3: Type into the Password field.

## step 4

show step4.caption: Type 17 characters into the 'API token' field
show step4.locator: getByLabel('API token')
show step4.url: app/index.html
show step4.where: login.spec.js:10
say step4: Type into the API token field.

## step 5

show step5.caption: Click the 'Sign in' button
show step5.locator: getByRole('button', { name: 'Sign in' })
show step5.url: app/index.html
show step5.where: login.spec.js:11
say step5: Click the Sign in button.

## step 6

show step6.caption: Expect the level-1 heading to have text “Welcome, Ada!”
show step6.locator: getByRole('heading', { level: 1 })
show step6.url: app/index.html
show step6.where: login.spec.js:12
show step6.expected: Welcome, Ada!
show step6.matcher: toHaveText
say step6: Expect the level-1 heading to have text Welcome, Ada!.

## passing steps summed up (when the film is long)

say skip: Then {n} more steps pass.

## failure

show fail.headline: expect(locator).toHaveText(expected) failed
show fail.expected: "Welcome, Ada!"
show fail.received: "Welcome back, Ada"
show fail.detail1: Timeout: 1500ms
show fail.call_log: unexpected value "Welcome back, Ada"
show fail.source: await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome, Ada!', { timeout: 1500 });
show fail.where: login.spec.js:12
show console1: Failed to load avatar for Ada: 404
say fail: Step 6 fails. It expected "Welcome, Ada!", but got "Welcome back, Ada". The console logged an error.

## end

show end.rerun: npx playwright test login.spec.js:6
show end.viewer: npx playwright show-trace trace.zip
say end: Run the command on screen to see it fail.

## masked

# step 2: Type 16 characters into the 'Email' field; the value is not shown or spoken; its field is covered on screen in steps 1-5
# step 3: Type 16 characters into the 'Password' field (a secret field); the value is not shown or spoken; its field is covered on screen in steps 2-5
# step 4: Type 17 characters into the 'API token' field (a secret field); the value is not shown or spoken; its field is covered on screen in steps 3-5
# a cover follows its field through the trace's page snapshots (shown while the field holds text, moved with the scroll); a fixed or animated field can still slip out from under it
# screenshots are shown as captured; --redact does not touch pixels
