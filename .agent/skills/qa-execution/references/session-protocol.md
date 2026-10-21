# Session Protocol

## The Execution Loop
1. **Enter:** Start exactly where the user starts (e.g., homepage, login).
2. **Act:** Perform the action as defined in the journey.
3. **Verify:** Check the observable result. Optimistic UI is not proof. Read the actual DOM, network response, or database state.
4. **Capture:** Note down what happened in the report.

## Evidence Standard
A `Pass` must survive a page refresh. If the state is lost on refresh, it is a `Fail`.

## Limitations for AI Agents
If you lack a browser-driving tool (like Playwright/Puppeteer), you must either:
1. Validate the API/Backend layer strictly using HTTP requests.
2. Output a step-by-step checklist for the human developer to click through in their browser.