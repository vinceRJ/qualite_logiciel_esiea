/* import { test, expect } from '@playwright/test';
test('mock localStorage avec tâches existantes', async ({ page }) => {
// Injecter un jeu de données avant que la page ne se charge
await page.addInitScript(() => {
const mockedTodos = [
{ title: 'Acheter du pain', completed: false },
{ title: 'Préparer le repas', completed: true },
{ title: 'Lire la documentation Playwright', completed: false }
];
localStorage.setItem('react-todos', JSON.stringify(mockedTodos));
});
await page.goto('https://demo.playwright.dev/todomvc');
// Vérification des tâches visibles dans l’interface
await expect(page.getByText('Acheter du pain')).toBeVisible();
await expect(page.getByText('Préparer le repas')).toBeVisible();
await expect(page.getByText('Lire la documentation Playwright')).toBeVisible();
});
*/

import { test, expect } from '@playwright/test';

test('mock localStorage avec 4 tâches, suppression et complétion', async ({ page }) => {
  // Injecter les données dans le localStorage avant le chargement de la page
  await page.addInitScript(() => {
    const mockedTodos = [
      { title: 'Acheter du pain', completed: false },
      { title: 'Aller courir', completed: false },
      { title: 'Lire un livre', completed: true }, // ✅ la 3e tâche est complétée
      { title: 'Préparer le repas', completed: false }
    ];

    // Je supprime la première tâche avant de stocker
    mockedTodos.shift(); // enlève "Acheter du pain"

    // Je sauvegarde le tableau modifié dans le localStorage
    localStorage.setItem('react-todos', JSON.stringify(mockedTodos));
  });

  // Ouvrir la page TodoMVC
  await page.goto('https://demo.playwright.dev/todomvc/');

  // Je vérifie que seules les 3 tâches attendues s'affichent
  await expect(page.getByText('Aller courir')).toBeVisible();
  await expect(page.getByText('Lire un livre')).toBeVisible();
  await expect(page.getByText('Préparer le repas')).toBeVisible();

  // Je vérifie que la première tâche supprimée n’apparaît plus
  await expect(page.getByText('Acheter du pain')).toHaveCount(0);

  // Je vérifie que la 3e ("Lire un livre") est bien marquée comme terminée (classe CSS .completed)
  const completedItem = page.locator('li.completed label', { hasText: 'Lire un livre' });
  await expect(completedItem).toBeVisible();
});
