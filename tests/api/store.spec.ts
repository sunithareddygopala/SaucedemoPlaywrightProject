import { expect, test } from '@playwright/test';

test.describe('Petstore Store API positive scenarios', () => {
  test('GET inventory returns available, pending, and sold counts', async ({ request }) => {
    // 1. Request the current store inventory.
    const response = await request.get('/v2/store/inventory');

    // 2. Verify the successful response and documented inventory status buckets.
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    const inventory = await response.json();
    expect(inventory).toEqual(expect.any(Object));
    expect(inventory).toEqual(
      expect.objectContaining({
        available: expect.any(Number),
        pending: expect.any(Number),
        sold: expect.any(Number),
      })
    );
    expect(Object.values(inventory)).toEqual(
      expect.arrayContaining([expect.any(Number)])
    );
  });

  test('creates, retrieves, and deletes a store order', async ({ request }) => {
    const orderId = Date.now();
    const order = {
      id: orderId,
      petId: 1,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    };

    // 1. Create a valid store order.
    const createResponse = await request.post('/v2/store/order', { data: order });
    expect(createResponse.status()).toBe(200);
    expect(createResponse.ok()).toBeTruthy();
    expect(await createResponse.json()).toMatchObject(order);

    // 2. Retrieve the created order by its ID.
    const getResponse = await request.get(`/v2/store/order/${orderId}`);
    expect(getResponse.status()).toBe(200);
    expect(getResponse.ok()).toBeTruthy();
    expect(await getResponse.json()).toMatchObject(order);

    // 3. Delete the created order.
    const deleteResponse = await request.delete(`/v2/store/order/${orderId}`);
    expect(deleteResponse.status()).toBe(200);
    expect(deleteResponse.ok()).toBeTruthy();
  });
});

test.describe('Petstore Store API negative scenarios', () => {
  test('GET nonexistent order returns not found', async ({ request }) => {
    // 1. Request an order ID that should not exist.
    const response = await request.get('/v2/store/order/2147483647');

    // 2. Verify the documented not-found response.
    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
  });

  test('DELETE nonexistent order returns not found', async ({ request }) => {
    // 1. Delete an order ID that should not exist.
    const response = await request.delete('/v2/store/order/2147483647');

    // 2. Verify the documented not-found response.
    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
  });

  test('POST order rejects a malformed request body', async ({ request }) => {
    // 1. Send a body with an invalid quantity type.
    const response = await request.post('/v2/store/order', {
      data: {
        id: Date.now(),
        petId: 1,
        quantity: 'invalid',
        shipDate: 'not-a-date',
        status: 'unknown',
        complete: false,
      },
    });

    // 2. Verify that the server rejects the malformed payload.
    expect([400, 422]).toContain(response.status());
    expect(response.ok()).toBeFalsy();
  });
});

test.describe('Petstore Store API edge scenarios', () => {
  test('GET order handles the minimum numeric order ID', async ({ request }) => {
    // 1. Request order ID zero, the lower numeric boundary.
    const response = await request.get('/v2/store/order/0');

    // 2. Verify the API returns a valid documented outcome.
    expect([200, 404]).toContain(response.status());
    if (response.status() === 200) {
      const order = await response.json();
      expect(order).toEqual(expect.objectContaining({ id: expect.any(Number) }));
    }
  });

  test('GET order handles a negative order ID without a client failure', async ({ request }) => {
    // 1. Request a negative path parameter.
    const response = await request.get('/v2/store/order/-1');

    // 2. Verify the API responds with a status instead of a transport error.
    expect([200, 404]).toContain(response.status());
  });

  test('creates an order with a zero quantity boundary', async ({ request }) => {
    const orderId = Date.now() + 1;
    const order = {
      id: orderId,
      petId: 1,
      quantity: 0,
      shipDate: new Date(0).toISOString(),
      status: 'placed',
      complete: false,
    };

    // 1. Submit the boundary order without assuming an undocumented business rule.
    const response = await request.post('/v2/store/order', { data: order });

    // 2. Verify the server returns a documented success or validation response.
    expect([200, 400, 422]).toContain(response.status());
    if (response.status() === 200) {
      expect(await response.json()).toMatchObject({ id: orderId, quantity: 0 });
      await request.delete(`/v2/store/order/${orderId}`);
    }
  });

  test('repeated DELETE returns a stable resource outcome', async ({ request }) => {
    const orderId = Date.now() + 2;
    const order = {
      id: orderId,
      petId: 1,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    };

    // 1. Create and delete a resource.
    const createResponse = await request.post('/v2/store/order', { data: order });
    expect(createResponse.status()).toBe(200);
    const firstDeleteResponse = await request.delete(`/v2/store/order/${orderId}`);
    expect(firstDeleteResponse.status()).toBe(200);

    // 2. Delete the same resource again and verify a stable API response.
    const secondDeleteResponse = await request.delete(`/v2/store/order/${orderId}`);
    expect([200, 404]).toContain(secondDeleteResponse.status());
  });
});
