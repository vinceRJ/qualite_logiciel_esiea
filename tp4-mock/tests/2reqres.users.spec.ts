import { test, expect } from '@playwright/test';

// 1. GET /{resource} - Fetches a resource list
test('mock GET /{resource} - liste des ressources', async ({ page }) => {
  await page.route('**/api/unknown', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        page: 1,
        per_page: 6,
        total: 12,
        total_pages: 2,
        data: [
          { id: 1, name: 'cerulean', year: 2000, color: '#98B2D1', pantone_value: '15-4020' },
          { id: 2, name: 'fuchsia rose', year: 2001, color: '#C74375', pantone_value: '17-2031' },
          { id: 3, name: 'true red', year: 2002, color: '#BF1932', pantone_value: '19-1664' }
        ]
      })
    });
  });

  await page.goto('https://reqres.in/');
  await page.click('text=List <Resource>');
  
  // Vérifications
  await expect(page.getByText('cerulean')).toBeVisible();
  await expect(page.getByText('fuchsia rose')).toBeVisible();
  
  // Nettoyage
  await page.unroute('**/api/unknown');
});

// 2. GET /users - Fetches a user list
test('mock GET /users - liste des utilisateurs', async ({ page }) => {
  await page.route('**/api/users?page=2', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        page: 2,
        per_page: 6,
        total: 12,
        total_pages: 2,
        data: [
          { 
            id: 7, 
            email: 'michael.lawson@reqres.in', 
            first_name: 'Michael', 
            last_name: 'Lawson',
            avatar: 'https://reqres.in/img/faces/7-image.jpg'
          },
          { 
            id: 8, 
            email: 'lindsay.ferguson@reqres.in', 
            first_name: 'Lindsay', 
            last_name: 'Ferguson',
            avatar: 'https://reqres.in/img/faces/8-image.jpg'
          }
        ]
      })
    });
  });

  await page.goto('https://reqres.in/');
  await page.click('text=List Users');
  
  // Vérifications
  await expect(page.getByText('Michael')).toBeVisible();
  await expect(page.getByText('Lindsay')).toBeVisible();
  
  // Nettoyage
  await page.unroute('**/api/users?page=2');
});

// 4. GET /users/{id} - User not found (404)
test('mock GET /users/{id} - utilisateur introuvable (404)', async ({ page }) => {
  await page.route('**/api/users/23', async route => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({})
    });
  });

  await page.goto('https://reqres.in/');
  
  // Attendre le clic et la réponse ensemble
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api/users/23')),
    page.click('text=Single User Not Found')
  ]);
  
  expect(response.status()).toBe(404);
  
  // Nettoyage
  await page.unroute('**/api/users/23');
});



// 11. PATCH /{resource}/{id} - Updates an unknown resource
test('mock PATCH /{resource}/{id} - mise à jour partielle ressource', async ({ page }) => {
  await page.route('**/api/unknown/2', async route => {
    if (route.request().method() === 'PATCH') {
      const postData = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: postData.name || 'Patched Resource',
          updatedAt: new Date().toISOString()
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://reqres.in/');
  // Navigation vers l'endpoint approprié
  
  // Nettoyage
  await page.unroute('**/api/unknown/2');
});

// 12. DELETE /{resource}/{id} - Deletes an unknown resource
test('mock DELETE /{resource}/{id} - suppression ressource', async ({ page }) => {
  await page.route('**/api/unknown/2', async route => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({
        status: 204,
        contentType: 'application/json',
        body: ''
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://reqres.in/');
  // Navigation vers l'endpoint approprié
  
  // Nettoyage
  await page.unroute('**/api/unknown/2');
});

// 13. POST /login - Creates a session
test('mock POST /login - connexion réussie', async ({ page }) => {
  await page.route('**/api/login', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'QpwL5tke4Pnpja7X4'
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://reqres.in/');
  await page.click('text=Login - Successful');
  
  // Vérifications
  await expect(page.getByText('QpwL5tke4Pnpja7X4')).toBeVisible();
  
  // Nettoyage
  await page.unroute('**/api/login');
});

// 14. POST /login - Failed login
test('mock POST /login - connexion échouée', async ({ page }) => {
  await page.route('**/api/login', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Missing password'
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://reqres.in/');
  await page.click('text=Login - Unsuccessful');
  
  // Vérifications
  await expect(page.getByText('Missing password')).toBeVisible();
  
  // Nettoyage
  await page.unroute('**/api/login');
});

// 15. POST /register - Creates a user
test('mock POST /register - inscription réussie', async ({ page }) => {
  await page.route('**/api/register', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 4,
          token: 'QpwL5tke4Pnpja7X4'
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://reqres.in/');
  await page.click('text=Register - Successful');
  
  // Vérifications
  await expect(page.getByText('QpwL5tke4Pnpja7X4')).toBeVisible();
  
  // Nettoyage
  await page.unroute('**/api/register');
});

// 16. POST /register - Failed registration
test('mock POST /register - inscription échouée', async ({ page }) => {
  await page.route('**/api/register', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Missing password'
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://reqres.in/');
  await page.click('text=Register - Unsuccessful');
  
  // Vérifications
  await expect(page.getByText('Missing password')).toBeVisible();
  
  // Nettoyage
  await page.unroute('**/api/register');
});

test('mock multiple routes - scénario complet', async ({ page }) => {
  // Mock de plusieurs endpoints en même temps
  await page.route('**/api/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'test-token-123' })
    });
  });

  await page.route('**/api/users?page=1', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          { id: 1, first_name: 'George', last_name: 'Bluth', email: 'george.bluth@reqres.in' }
        ]
      })
    });
  });

  await page.goto('https://reqres.in/');
  
  // Nettoyage de tous les mocks
  await page.unroute('**/api/login');
  await page.unroute('**/api/users?page=1');
});
