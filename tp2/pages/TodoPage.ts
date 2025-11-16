import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly input: Locator;
  readonly todoItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByRole('textbox', { name: 'What needs to be done?' });
    this.todoItems = page.locator('.todo-list li');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTask(taskName: string) {
    await this.input.fill(taskName);
    await this.page.keyboard.press('Enter');
  }

  async deleteTask(taskName: string) {
    const task = this.page.locator('.todo-list li', { hasText: taskName });
    await task.hover();
    await task.locator('.destroy').click();
  }

  async completeTask(taskName: string) {
    const task = this.page.locator('.todo-list li', { hasText: taskName });
    await task.locator('.toggle').check();
  }

  // Méthodes de vérification explicites (is…)
  async isTaskVisible(taskName: string) {
    return this.page.getByText(taskName);
  }

  async isTaskCompleted(taskName: string) {
    const task = this.page.locator('.todo-list li', { hasText: taskName });
    return task;
  }
}
