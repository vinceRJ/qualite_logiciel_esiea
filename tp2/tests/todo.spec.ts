import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test('ajouter et compléter une tâche', async ({ page }) => {
  const todoPage = new TodoPage(page);

  await todoPage.goto();
  await todoPage.addTask('Acheter du café');

  // ✅ Les assertions sont dans le test
  await expect(todoPage.isTaskVisible('Acheter du café')).toBeVisible();

  await todoPage.completeTask('Acheter du café');
  await expect(todoPage.isTaskCompleted('Acheter du café')).toHaveClass(/completed/);
});
