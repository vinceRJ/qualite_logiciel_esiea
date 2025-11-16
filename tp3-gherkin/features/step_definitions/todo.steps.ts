import { Given, When, Then, Before, After } from '@cucumber/cucumber';
 import { chromium, Browser, Page, expect } from '@playwright/test';
 let browser: Browser;
 let page: Page;
 // Hook exécuté avant chaque scénario
 Before(async () => {
 browser = await chromium.launch({
 headless: false, // ← Mode headed
 slowMo: 200 // Optionnel : ralentit les actions pour mieux voir
 });
 const context = await browser.newContext();
 page = await context.newPage();
 });
 // Hook exécuté après chaque scénario
 After(async () => {
 await browser.close();
 });
 Given('je suis sur la page TodoMVC', async () => {
 await page.goto('https://demo.playwright.dev/todomvc');
 });
 When('j’ajoute la tâche {string}', async (task: string) => {
 await page.getByPlaceholder('What needs to be done?').fill(task);
 await page.keyboard.press('Enter');
 });
 Then('la tâche {string} est visible dans la liste', async (task: string) => {
 await expect(page.getByText(task)).toBeVisible();
 });
